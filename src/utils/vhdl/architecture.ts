import {Edge, getConnectedEdges, Node} from 'reactflow';

import {RESET_NODE_ID} from '@constants/nodes.constants';
import {DEFAULT_CLK_PORT, DEFAULT_RESET_PORT} from '@constants/ports.constants';
import {
  VHDL_FSM_END_SECTION,
  VHDL_INLINE_COMMENT,
  VHDL_FSM_ARCHITECTURE_HEADER,
  VHDL_FSM_ARCHITECTURE_TYPE,
  VHDL_FSM_ARCHITECTURE_SIGNALS,
  VHDL_BEGIN,
  VHDL_BEGIN_PROCESS,
  VHDL_END_PROCESS,
  VHDL_FSM_ARCHITECTURE_FOOTER,
  VHDL_FSM_STATE_PROCESS_HEADER,
  VHDL_FSM_STATE_PROCESS_FOOTER,
  VHDL_WHEN,
  VHDL_DEFINITION_ARROW,
  VHDL_FSM_STATE_PROCESS_WHEN_OTHERS,
  VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN,
  VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT,
  VHDL_ASSIGNMENT_ARROW,
  VHDL_AND,
  VHDL_OR,
  VHDL_FSM_STATE_PROCESS_TRANSITION_ERROR,
  VHDL_SELECTOR_NAME,
  VHDL_SELECTOR_NAME_2,
  VHDL_FSM_CLOCK_PROCESS_CONDITION_1,
  VHDL_FSM_CLOCK_PROCESS_CONDITION_2,
  VHDL_FSM_CLOCK_PROCESS_CONTENT_1,
  VHDL_FSM_CLOCK_PROCESS_CONTENT_2,
  VHDL_FSM_ARCHITECTURE_STATE_NAME,
  VHDL_FSM_RESET_ERROR,
  VHDL_FSM_RESET_INVALID_ERROR,
  VHDL_END_IF,
  VHDL_FSM_STATE_PROCESS_DATA_OTHERS_COMMENT,
} from '@constants/vhdl';
import Port from '@models/port';
import FSMState from '@models/state';
import {PortLogic} from '@models/state';
import {ConditionElement} from '@models/transduction';
import FSMTransition from '@models/transition';
import {LogicalOperator} from '@models/transition';
import {getStringWithBreakLines} from '@utils/transduction';

import {getEntityPortType} from './entity';
import {
  getStatesFromNodes,
  getVhdlConditionSection,
  getVhdlFsmTransitionConditionFromLogic,
  getVhdlPortValue,
  getVhdlStateName,
  vhdlCodeLine,
} from './utils';

function getArchitectureSection(
  tabAmount: number,
  architectureName: string,
  entityName: string,
  getDefinition: (tabAmount: number) => string,
  getContent: (tabAmount: number) => string,
) {
  return (
    vhdlCodeLine(
      VHDL_FSM_ARCHITECTURE_HEADER.replace(
        VHDL_SELECTOR_NAME,
        architectureName,
      ).replace(VHDL_SELECTOR_NAME_2, entityName),
      tabAmount,
      false,
    ) +
    getDefinition(tabAmount + 1) +
    vhdlCodeLine(VHDL_BEGIN, tabAmount, false) +
    getContent(tabAmount + 1) +
    vhdlCodeLine(
      VHDL_FSM_ARCHITECTURE_FOOTER.replace(
        VHDL_SELECTOR_NAME,
        architectureName,
      ),
      tabAmount,
    )
  );
}

function getProcessSection(
  tabAmount: number,
  portList: string[],
  getContent: (tabAmount: number) => string,
) {
  return (
    vhdlCodeLine(
      VHDL_BEGIN_PROCESS + portList.join(', ') + VHDL_FSM_END_SECTION,
      tabAmount,
      false,
      false,
    ) +
    vhdlCodeLine(VHDL_BEGIN, tabAmount, false) +
    getContent(tabAmount + 1) +
    vhdlCodeLine(VHDL_END_PROCESS, tabAmount)
  );
}

function getCaseWhens(
  tabAmount: number,
  conditions: ConditionElement[],
  getDefault?: (tabAmount: number) => string,
) {
  const whens: string[] = [];

  conditions.forEach(condition => {
    whens.push(
      vhdlCodeLine(
        VHDL_WHEN + condition.conditionText + VHDL_DEFINITION_ARROW,
        tabAmount,
        false,
      ),
    );
    whens.push(condition.getConditionContent(tabAmount + 1));
  });

  if (getDefault) {
    whens.push(
      vhdlCodeLine(VHDL_FSM_STATE_PROCESS_WHEN_OTHERS, tabAmount, false),
    );
    whens.push(getDefault(tabAmount + 1));
  }

  return [...whens].join('');
}

function getCasesSection(
  tabAmount: number,
  conditions: ConditionElement[],
  getDefault?: (tabAmount: number) => string,
) {
  if (conditions.length === 0) {
    if (getDefault) {
      return getDefault(tabAmount);
    }
    return '';
  }

  const cases = getCaseWhens(tabAmount + 1, conditions, getDefault);

  return (
    vhdlCodeLine(VHDL_FSM_STATE_PROCESS_HEADER, tabAmount, false, false) +
    cases +
    vhdlCodeLine(VHDL_FSM_STATE_PROCESS_FOOTER, tabAmount)
  );
}

function getVhdlArchitectureStateNameList(nodes: Node<FSMState>[]) {
  return getStatesFromNodes(nodes)
    .sort(node => node.data.stateNumber)
    .map(node => getVhdlStateName(node))
    .join(', ');
}

function getVhdlFsmArchitectureDefinitions(
  tabAmount: number,
  nodes: Node<FSMState>[],
  internalsList: Port[],
) {
  const stateList = getVhdlArchitectureStateNameList(nodes);

  // Generate internal signals
  const internalSignals = internalsList
    .map(internal =>
      vhdlCodeLine(
        `signal ${internal.id_name} : ${getEntityPortType(internal)}`,
        tabAmount,
      ),
    )
    .join('');

  return (
    vhdlCodeLine(
      VHDL_FSM_ARCHITECTURE_TYPE + stateList + VHDL_FSM_END_SECTION,
      tabAmount,
    ) +
    vhdlCodeLine(VHDL_FSM_ARCHITECTURE_SIGNALS, tabAmount) +
    internalSignals
  );
}

function getStateByNodeId(nodes: Node<FSMState>[], nodeId: string) {
  return nodes.find(node => node.id === nodeId);
}

function getVhdlFsmFirstStateName(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstTransition = edges.find(edge => edge.source === RESET_NODE_ID);

  if (firstTransition) {
    const state = getStateByNodeId(nodes, firstTransition.target);
    return state
      ? getVhdlStateName(state)
      : VHDL_INLINE_COMMENT + VHDL_FSM_RESET_INVALID_ERROR;
  }

  return VHDL_INLINE_COMMENT + VHDL_FSM_RESET_ERROR;
}

function getVhdlFsmArchitectureClockProcess(
  tabAmount: number,
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const clockProcessPortList = [DEFAULT_CLK_PORT, DEFAULT_RESET_PORT].map(
    port => port.id_name,
  );
  const firstState = getVhdlFsmFirstStateName(nodes, edges);

  function getProcessContent(contentTabs: number) {
    const conditions: ConditionElement[] = [
      {
        conditionText: VHDL_FSM_CLOCK_PROCESS_CONDITION_1,
        getConditionContent: (conditionTabs: number) =>
          vhdlCodeLine(
            VHDL_FSM_CLOCK_PROCESS_CONTENT_1 + firstState,
            conditionTabs,
          ),
      },
      {
        conditionText: VHDL_FSM_CLOCK_PROCESS_CONDITION_2,
        getConditionContent: (conditionTabs: number) =>
          vhdlCodeLine(VHDL_FSM_CLOCK_PROCESS_CONTENT_2, conditionTabs),
      },
    ];

    return getVhdlConditionSection(contentTabs, conditions);
  }

  const commentLine = vhdlCodeLine('-- State Register', tabAmount, false);
  return (
    commentLine +
    getProcessSection(tabAmount, clockProcessPortList, getProcessContent)
  );
}

function getVhdlFsmArchitecturePortLogicAssignment(
  tabAmount: number,
  portLogic: PortLogic,
) {
  let outputPort = portLogic.port.id_name;
  if (
    (portLogic as any).from !== undefined &&
    (portLogic as any).to !== undefined &&
    (portLogic as any).from !== '' &&
    (portLogic as any).to !== ''
  ) {
    outputPort = `${outputPort}(${(portLogic as any).from} downto ${(portLogic as any).to})`;
  }

  const assignment =
    outputPort + VHDL_ASSIGNMENT_ARROW + getVhdlPortValue(portLogic);

  return vhdlCodeLine(assignment, tabAmount);
}

function getVhdlFsmArchitectureStateAssignmentLines(
  tabAmount: number,
  portLogic: {
    [key: string]: PortLogic;
  },
) {
  const logicKeys = Object.keys(portLogic);
  if (logicKeys.length === 0) return '';

  return logicKeys
    .map(key =>
      getVhdlFsmArchitecturePortLogicAssignment(tabAmount, portLogic[key]),
    )
    .join('');
}

function getVhdlFsmArchitectureStateAssignments(
  tabAmount: number,
  state: Node<FSMState>,
) {
  const {internals, outputs} = state.data.portLogic;
  const internalLines = getVhdlFsmArchitectureStateAssignmentLines(
    tabAmount,
    internals,
  );
  const outputLines = getVhdlFsmArchitectureStateAssignmentLines(
    tabAmount,
    outputs,
  );

  return internalLines + outputLines;
}

function getTransitionTargetLine(
  tabAmount: number,
  targetId: string,
  allStates: Node<FSMState>[],
) {
  const targetState = allStates.find(state => state.id === targetId);

  if (targetState) {
    return vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + getVhdlStateName(targetState),
      tabAmount,
    );
  }

  return vhdlCodeLine(
    VHDL_FSM_STATE_PROCESS_TRANSITION_ERROR,
    tabAmount,
    false,
    true,
  );
}

function getVhdlFsmArchitectureStateTransitionConditions(
  currentEdges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
): ConditionElement[] {
  const transitionConditions = currentEdges.map((edge): ConditionElement => {
    if (edge.data) {
      const {portLogic, operator} = edge.data;
      const {inputs, internals} = portLogic;

      const inputConditions = Object.keys(inputs).map(inputKey =>
        getVhdlFsmTransitionConditionFromLogic(inputs[inputKey]),
      );

      const internalConditions = Object.keys(internals).map(internalsKey =>
        getVhdlFsmTransitionConditionFromLogic(internals[internalsKey]),
      );

      const portConditionsText = [
        ...inputConditions,
        ...internalConditions,
      ].join(operator === LogicalOperator.And ? VHDL_AND : VHDL_OR);

      const getConditionContent = (contentTab: number) => {
        return getTransitionTargetLine(contentTab, edge.target, allStates);
      };

      // If there is a port condition, use it as a condition.
      // If not, leave conditionText empty so it can be handled as 'else' below.
      return {conditionText: portConditionsText, getConditionContent};
    }

    return {conditionText: '', getConditionContent: () => ''};
  });

  const emptyConditionIndexes = transitionConditions
    .map((cond, idx) => ((cond.conditionText ?? '').trim() === '' ? idx : -1))
    .filter(idx => idx !== -1);

  // If there is at least one edge with empty condition, make the first one the else/default,
  // and remove any additional default/else that would be added.
  if (emptyConditionIndexes.length > 0) {
    const firstEmptyIdx = emptyConditionIndexes[0];
    const defaultCondition = transitionConditions[firstEmptyIdx];
    const filteredConditions = transitionConditions.filter(
      (cond, idx) =>
        idx !== firstEmptyIdx && (cond.conditionText ?? '').trim() !== '',
    );
    return [...filteredConditions, defaultCondition];
  }

  const getDefaultConditionContent = (contentTab: number) => {
    const targetState = allStates.find(
      state => state.id === currentEdges[0].source,
    );

    return getTransitionTargetLine(
      contentTab,
      targetState?.id ?? '',
      allStates,
    );
  };

  const defaultCondition: ConditionElement = {
    conditionText: '',
    getConditionContent: getDefaultConditionContent,
  };

  const hasSingleEdgeWithEmptyTransitionCondition =
    transitionConditions.length === 1 &&
    transitionConditions[0].conditionText === '';

  if (hasSingleEdgeWithEmptyTransitionCondition)
    return [...transitionConditions];

  return [...transitionConditions, defaultCondition];
}

function getVhdlFsmArchitectureStateTransitionConditionLines(
  tabAmount: number,
  currentEdges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
) {
  const conditions = getVhdlFsmArchitectureStateTransitionConditions(
    currentEdges,
    allStates,
  );

  return getVhdlConditionSection(tabAmount, conditions);
}

function getVhdlFsmArchitectureStateTransition(
  tabAmount: number,
  state: Node<FSMState>,
  edges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
) {
  const currentEdges = getConnectedEdges([state], edges).filter(
    edge => edge.source === state.id,
  );

  if (currentEdges.length === 0) {
    return vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + getVhdlStateName(state),
      tabAmount,
    );
  } else {
    return getVhdlFsmArchitectureStateTransitionConditionLines(
      tabAmount,
      currentEdges,
      allStates,
    );
  }
}

function getVhdlFsmArchitectureStateTransitionProcess(
  tabAmount: number,
  inputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  // Sensitivity list contains all ports used in transition conditions
  const usedPortIds = new Set<string>();
  edges.forEach(edge => {
    if (edge.data) {
      const {portLogic} = edge.data;
      Object.keys(portLogic.inputs).forEach(id => usedPortIds.add(id));
      Object.keys(portLogic.internals).forEach(id => usedPortIds.add(id));
    }
  });
  const usedInputPorts = inputList.filter(port => usedPortIds.has(port.id));
  const usedInternalPorts = internalsList.filter(port =>
    usedPortIds.has(port.id),
  );
  const stateProcessPortList = [
    VHDL_FSM_ARCHITECTURE_STATE_NAME,
    ...usedInputPorts.map(input => input.id_name),
    ...usedInternalPorts.map(internal => internal.id_name),
  ];

  function getProcessContent(contentTabs: number) {
    const firstState = getVhdlFsmFirstStateName(nodes, edges);
    const states = getStatesFromNodes(nodes);
    const conditions = states.map((state): ConditionElement => {
      return {
        conditionText: getVhdlStateName(state),
        getConditionContent: (tabAmount: number) => {
          return getVhdlFsmArchitectureStateTransition(
            tabAmount,
            state,
            edges,
            states,
          );
        },
      };
    });

    const cases = getCasesSection(
      contentTabs,
      conditions,
      contentTab =>
        vhdlCodeLine(
          VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT,
          contentTab,
          false,
          true,
        ) +
        vhdlCodeLine(
          VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + firstState,
          contentTab,
        ),
    );

    return cases;
  }

  const commentLine = vhdlCodeLine(
    '-- State Transition Logic',
    tabAmount,
    false,
  );
  return (
    commentLine +
    getProcessSection(tabAmount, stateProcessPortList, getProcessContent)
  );
}

function getVhdlFsmArchitectureStateAssignmentProcess(
  tabAmount: number,
  outputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
) {
  const clockProcessPortList = [DEFAULT_CLK_PORT, DEFAULT_RESET_PORT].map(
    port => port.id_name,
  );

  function getProcessContent(contentTabs: number) {
    // Generate initialization for all ports (outputs and internals) with zero
    const allPorts = [...outputList, ...internalsList];
    const zeroAssignments = allPorts
      .map(port => {
        let zeroValue = "'0'";
        if (
          port.type === 'logic_vector' &&
          typeof port.defaultValue === 'string'
        ) {
          zeroValue = `"${'0'.repeat(port.defaultValue.length)}"`;
        } else if (
          port.type === 'integer' &&
          typeof port.defaultValue === 'number'
        ) {
          zeroValue = '0';
        }
        return vhdlCodeLine(
          `${port.id_name} ${VHDL_ASSIGNMENT_ARROW} ${zeroValue}`,
          contentTabs + 1,
        );
      })
      .join('');

    // Generate state assignments for each state
    const states = getStatesFromNodes(nodes);
    const stateAssignments = states.map((state): ConditionElement => {
      return {
        conditionText: getVhdlStateName(state),
        getConditionContent: (tabAmount: number) => {
          return getVhdlFsmArchitectureStateAssignments(tabAmount, state);
        },
      };
    });
    const cases = getCasesSection(
      contentTabs + 1,
      stateAssignments,
      tabAmount =>
        vhdlCodeLine(
          VHDL_FSM_STATE_PROCESS_DATA_OTHERS_COMMENT,
          tabAmount,
          false,
          true,
        ),
    );

    return (
      vhdlCodeLine(
        `if ${VHDL_FSM_CLOCK_PROCESS_CONDITION_1} then`,
        contentTabs,
        false,
      ) +
      zeroAssignments +
      vhdlCodeLine(
        `elsif ${VHDL_FSM_CLOCK_PROCESS_CONDITION_2} then`,
        contentTabs,
        false,
      ) +
      cases +
      vhdlCodeLine(`${VHDL_END_IF}`, contentTabs)
    );
  }

  const commentLine = vhdlCodeLine('-- Data Logic', tabAmount, false);
  return (
    commentLine +
    getProcessSection(tabAmount, clockProcessPortList, getProcessContent)
  );
}

export function generateVhdlFsmArchitecture(
  tabAmount: number,
  architectureName: string,
  entityName: string,
  inputList: Port[],
  outputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const getDefinitions = (contentTabs: number) => {
    return getVhdlFsmArchitectureDefinitions(contentTabs, nodes, internalsList);
  };

  const getContent = (contentTabs: number) => {
    const clockProcess = getVhdlFsmArchitectureClockProcess(
      contentTabs,
      nodes,
      edges,
    );
    const stateTransitionProcess = getVhdlFsmArchitectureStateTransitionProcess(
      contentTabs,
      inputList,
      internalsList,
      nodes,
      edges,
    );
    const stateAssignmentProcess = getVhdlFsmArchitectureStateAssignmentProcess(
      contentTabs,
      outputList,
      internalsList,
      nodes,
    );

    return getStringWithBreakLines([
      clockProcess,
      stateTransitionProcess,
      stateAssignmentProcess,
    ]);
  };

  return getArchitectureSection(
    tabAmount,
    architectureName,
    entityName,
    getDefinitions,
    getContent,
  );
}
