import {Edge, getConnectedEdges, Node} from 'reactflow';

import {START_NODE_ID} from '@constants/nodes.constants';
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
  VHDL_STATE_PREFIX,
  VHDL_END_IF,
  VHDL_FSM_ARCHITECTURE_FOOTER,
  VHDL_FSM_STATE_PROCESS_HEADER,
  VHDL_FSM_STATE_PROCESS_FOOTER,
  VHDL_WHEN,
  VHDL_DEFINITION_ARROW,
  VHDL_FSM_STATE_PROCESS_WHEN_OTHERS,
  VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN,
  VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT,
  VHDL_ASSIGNMENT_ARROW,
  VHDL_TAB_DEPTH,
  VHDL_ELSE,
  VHDL_IF,
  VHDL_ELSIF,
  VHDL_THEN,
  VHDL_FSM_STATE_PROCESS_PORT_COMMENT,
  VHDL_FSM_STATE_PROCESS_DEAD_COMMENT,
  VHDL_EQUALITY,
  VHDL_INEQUALITY,
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
} from '@constants/vhdl';
import Port from '@models/port';
import {PortTypeEnum} from '@models/port';
import FSMState from '@models/state';
import {LogicType, PortLogic} from '@models/state';
import {ConditionElement} from '@models/transduction';
import FSMTransition from '@models/transition';
import {LogicalOperator} from '@models/transition';
import {getStringWithBreakLines} from '@utils/transduction';

import {getVhdlConditionSection, vhdlCodeLine} from './utils';

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
  getDefault: (tabAmount: number) => string,
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
  whens.push(
    vhdlCodeLine(VHDL_FSM_STATE_PROCESS_WHEN_OTHERS, tabAmount, false),
  );
  whens.push(getDefault(tabAmount + 1));

  return [...whens].join('');
}

function getCasesSection(
  tabAmount: number,
  conditions: ConditionElement[],
  getDefault: (tabAmount: number) => string,
) {
  if (conditions.length === 0) return getDefault(tabAmount);

  const cases = getCaseWhens(tabAmount + 1, conditions, getDefault);
  return (
    vhdlCodeLine(VHDL_FSM_STATE_PROCESS_HEADER, tabAmount, false, false) +
    cases +
    vhdlCodeLine(VHDL_FSM_STATE_PROCESS_FOOTER, tabAmount)
  );
}

function getVhdlStateName(state: Node<FSMState>) {
  return VHDL_STATE_PREFIX + state.data.stateNumber;
}

function getStatesFromNodes(nodes: Node<FSMState>[]) {
  return nodes.filter(node => node.id !== START_NODE_ID);
}

function getVhdlArchitectureStateList(nodes: Node<FSMState>[]) {
  return getStatesFromNodes(nodes)
    .sort(node => node.data.stateNumber)
    .map(node => getVhdlStateName(node))
    .join(', ');
}

function getVhdlFsmArchitectureDefinitions(
  tabAmount: number,
  nodes: Node<FSMState>[],
) {
  const stateList = getVhdlArchitectureStateList(nodes);

  return (
    vhdlCodeLine(
      VHDL_FSM_ARCHITECTURE_TYPE + stateList + VHDL_FSM_END_SECTION,
      tabAmount,
    ) + vhdlCodeLine(VHDL_FSM_ARCHITECTURE_SIGNALS, tabAmount)
  );
}

function getStateByNodeId(nodes: Node<FSMState>[], nodeId: string) {
  return nodes.find(node => node.id === nodeId);
}

function getVhdlFsmFirstStateName(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstTransition = edges.find(edge => edge.source === START_NODE_ID);
  if (firstTransition) {
    const state = getStateByNodeId(nodes, firstTransition.target);
    return state
      ? getVhdlStateName(state)
      : VHDL_INLINE_COMMENT + 'Error! Start node connection is invalid';
  }
  return VHDL_INLINE_COMMENT + 'Error! Start node is not connected to anything';
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

  return getProcessSection(tabAmount, clockProcessPortList, getProcessContent);
}

function getPortDefaultValue(port: Port) {
  switch (port.type) {
    case PortTypeEnum.Logic:
      return port.defaultValue ? "'1'" : "'0'";
    case PortTypeEnum.Integer:
      return '"' + Number(port.defaultValue).toString(2) + '"';
    case PortTypeEnum.LogicVector:
      return '"' + String(port.defaultValue) + '"';
  }
}

function getVhdlFsmArchitecturePortValue(portLogic: PortLogic) {
  switch (portLogic.type) {
    case LogicType.Equality:
    case LogicType.Inequality:
    case LogicType.Custom:
      return portLogic.customValue;
    case LogicType.LogicalCustom: // Not supported yet
    case LogicType.LogicalNot: // Not supported yet
    case LogicType.LogicalOr: // Not supported yet
    case LogicType.LogicalAnd: // Not supported yet
    case LogicType.IntegerSubtract: // Not supported yet
    case LogicType.IntegerSum: // Not supported yet
    case LogicType.Default:
    default:
      return getPortDefaultValue(portLogic.port);
  }
}

function getVhdlFsmArchitecturePortLogicAssignment(
  tabAmount: number,
  portLogic: PortLogic,
) {
  const assignment =
    portLogic.port.id_name +
    VHDL_ASSIGNMENT_ARROW +
    getVhdlFsmArchitecturePortValue(portLogic);
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
  let stateAssignmentLines = internalLines + outputLines;
  if (stateAssignmentLines === '')
    stateAssignmentLines = vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_PORT_COMMENT,
      tabAmount,
      false,
      true,
    );
  return stateAssignmentLines;
}

function getVhdlFsmArchitectureStateTransitionElseCase(state: Node<FSMState>) {
  return (
    vhdlCodeLine(VHDL_ELSE, VHDL_TAB_DEPTH.FOUR_TABS, false) +
    vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + getVhdlStateName(state),
      VHDL_TAB_DEPTH.FIVE_TABS,
    ) +
    vhdlCodeLine(VHDL_END_IF, VHDL_TAB_DEPTH.FOUR_TABS)
  );
}

function generateVHDLConditionSection(
  conditions: string[],
  contentLines: string[],
  elseLine: string,
  tabDepth: VHDL_TAB_DEPTH,
) {
  const elseConditionLine = vhdlCodeLine(VHDL_ELSE, tabDepth, false);
  const conditionLines = conditions.map((condition, index) => {
    if (index === 0) {
      return vhdlCodeLine(VHDL_IF + condition + VHDL_THEN, tabDepth, false);
    } else {
      return vhdlCodeLine(VHDL_ELSIF + condition + VHDL_THEN, tabDepth, false);
    }
  });

  const dynamicConditionBlockLines = conditionLines
    .map((line, index) => [line, contentLines[index]].join(''))
    .join('');

  const completeCondition = [
    dynamicConditionBlockLines,
    elseConditionLine,
    elseLine,
    vhdlCodeLine(VHDL_END_IF, tabDepth),
  ].join('');

  return completeCondition;
}

function getVhdlFsmArchitectureTransitionConditionFromLogic(
  portLogic: PortLogic,
) {
  switch (portLogic.type) {
    case LogicType.Equality:
      return portLogic.port.id_name + VHDL_EQUALITY + portLogic.customValue;
    case LogicType.Inequality:
      return portLogic.port.id_name + VHDL_INEQUALITY + portLogic.customValue;
    case LogicType.Default:
    default:
      return (
        portLogic.port.id_name + VHDL_EQUALITY + portLogic.port.defaultValue
      );
  }
}

function getTransitionTargetLine(
  targetId: string,
  allStates: Node<FSMState>[],
) {
  const targetState = allStates.find(state => state.id === targetId);
  if (targetState) {
    return vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + getVhdlStateName(targetState),
      VHDL_TAB_DEPTH.FIVE_TABS,
    );
  }
  return vhdlCodeLine(
    VHDL_FSM_STATE_PROCESS_TRANSITION_ERROR,
    VHDL_TAB_DEPTH.FIVE_TABS,
    false,
    true,
  );
}

function getVhdlFsmArchitectureStateTransitionConditionLines(
  tabAmount: number,
  state: Node<FSMState>,
  currentEdges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
) {
  const elseCase = getVhdlFsmArchitectureStateTransitionElseCase(state);

  if (currentEdges.length === 0) {
    return (
      vhdlCodeLine(
        VHDL_FSM_STATE_PROCESS_DEAD_COMMENT,
        tabAmount,
        false,
        true,
      ) + elseCase
    );
  } else {
    const lineData = currentEdges.map(edge => {
      if (edge.data) {
        const {portLogic, operator} = edge.data;
        const {inputs, internals} = portLogic;

        const inputConditions = Object.keys(inputs).map(inputKey =>
          getVhdlFsmArchitectureTransitionConditionFromLogic(inputs[inputKey]),
        );

        const internalConditions = Object.keys(internals).map(internalsKey =>
          getVhdlFsmArchitectureTransitionConditionFromLogic(
            internals[internalsKey],
          ),
        );

        const conditions = [...inputConditions, ...internalConditions].join(
          operator === LogicalOperator.And ? VHDL_AND : VHDL_OR,
        );
        const targetLines = getTransitionTargetLine(edge.target, allStates);

        return [conditions, targetLines];
      }
      return ['', ''];
    });

    const elseContentLine = getTransitionTargetLine(
      currentEdges[0].source,
      allStates,
    );

    const conditionLines = generateVHDLConditionSection(
      lineData.map(data => data[0]),
      lineData.map(data => data[1]),
      elseContentLine,
      tabAmount,
    );

    return conditionLines;
  }
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
      state,
      currentEdges,
      allStates,
    );
  }
}

function getVhdlFsmArchitectureStateCase(
  tabAmount: number,
  state: Node<FSMState>,
  edges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
) {
  const definitions = getVhdlFsmArchitectureStateAssignments(tabAmount, state);
  const transition = getVhdlFsmArchitectureStateTransition(
    tabAmount,
    state,
    edges,
    allStates,
  );

  return definitions + transition;
}

function getVhdlFsmArchitectureProcessConditions(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const states = getStatesFromNodes(nodes);
  const conditions = states.map((state): ConditionElement => {
    return {
      conditionText: getVhdlStateName(state),
      getConditionContent: (tabAmount: number) => {
        return getVhdlFsmArchitectureStateCase(tabAmount, state, edges, states);
      },
    };
  });

  return conditions;
}

function getVhdlFsmArchitectureStateProcessCaseSection(
  tabAmount: number,
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstState = getVhdlFsmFirstStateName(nodes, edges);

  const conditions = getVhdlFsmArchitectureProcessConditions(nodes, edges);

  const cases = getCasesSection(
    tabAmount,
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

function getVhdlFsmArchitectureStateProcess(
  tabAmount: number,
  inputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const stateProcessPortList = [
    VHDL_FSM_ARCHITECTURE_STATE_NAME,
    ...inputList.map(input => input.id_name),
    ...internalsList.map(internal => internal.id_name),
  ];

  function getProcessContent(contentTabs: number) {
    const caseSection = getVhdlFsmArchitectureStateProcessCaseSection(
      contentTabs,
      nodes,
      edges,
    );
    return caseSection;
  }

  return getProcessSection(tabAmount, stateProcessPortList, getProcessContent);
}

export function generateVhdlFsmArchitecture(
  tabAmount: number,
  architectureName: string,
  entityName: string,
  inputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const getDefinitions = (contentTabs: number) => {
    return getVhdlFsmArchitectureDefinitions(contentTabs, nodes);
  };

  const getContent = (contentTabs: number) => {
    const clockProcess = getVhdlFsmArchitectureClockProcess(
      contentTabs,
      nodes,
      edges,
    );
    const stateProcess = getVhdlFsmArchitectureStateProcess(
      contentTabs,
      inputList,
      internalsList,
      nodes,
      edges,
    );

    return getStringWithBreakLines([clockProcess, stateProcess]);
  };

  return getArchitectureSection(
    tabAmount,
    architectureName,
    entityName,
    getDefinitions,
    getContent,
  );
}
