import {Edge, getConnectedEdges, Node} from 'reactflow';

import {RESET_NODE_ID} from '@constants/nodes.constants';
import {DEFAULT_CLK_PORT, DEFAULT_RESET_PORT} from '@constants/ports.constants';
import {
  VERILOG_MODULE_HEADER,
  VERILOG_MODULE_FOOTER,
  VERILOG_MODULE_END_FOOTER,
  VERILOG_STATE_ENUM_TYPE,
  VERILOG_STATE_REG_DECL,
  VERILOG_BEGIN,
  VERILOG_END,
  VERILOG_AND,
  VERILOG_OR,
  VERILOG_DATA_OTHERS_COMMENT,
  VERILOG_RESET_ERROR,
  VERILOG_RESET_INVALID_ERROR,
  VERILOG_TRANSITION_ERROR,
  VERILOG_INLINE_COMMENT,
  VERILOG_ALWAYS_COMB,
  VERILOG_ALWAYS_FF,
  VERILOG_IF_RESET,
  VERILOG_ELSE,
  VERILOG_ASSIGNMENT_ARROW,
} from '@constants/verilog';
import Port, {PortTypeEnum} from '@models/port';
import FSMState from '@models/state';
import {PortLogic} from '@models/state';
import {ConditionElement} from '@models/transduction';
import FSMTransition, {LogicalOperator} from '@models/transition';
import {getStringWithBreakLines} from '@utils/transduction';

import {
  getStatesFromNodes,
  getVerilogConditionSection,
  getVerilogFsmTransitionConditionFromLogic,
  getVerilogPortValue,
  getVerilogPortWithRange,
  getVerilogStateName,
  verilogCodeLine,
} from './utils';

function getVerilogPortType(port: Port) {
  switch (port.type) {
    case PortTypeEnum.LogicVector:
      return `logic [${String(String(port.defaultValue).length - 1)}:0]`;
    case PortTypeEnum.Logic:
      return 'logic';
    case PortTypeEnum.Integer:
      return 'integer';
    default:
      return 'logic';
  }
}

function getVerilogPortDecl(port: Port, direction: 'input' | 'output' | '') {
  const type = getVerilogPortType(port);
  if (direction === 'input') {
    return `input ${type} ${port.id_name}`;
  } else if (direction === 'output') {
    return `output ${type} ${port.id_name}`;
  } else {
    return `${type} ${port.id_name}`;
  }
}

function getModuleSection(
  tabAmount: number,
  moduleName: string,
  inputList: Port[],
  outputList: Port[],
  internalsList: Port[],
  getContent: (tabAmount: number) => string,
) {
  const inputDecls = inputList.map(p => getVerilogPortDecl(p, 'input'));
  const outputDecls = outputList.map(p => getVerilogPortDecl(p, 'output'));

  const clkResetDecls = [
    `input logic ${DEFAULT_CLK_PORT.id_name}`,
    `input logic ${DEFAULT_RESET_PORT.id_name}`,
  ];
  const allPortDecls = [...clkResetDecls, ...inputDecls, ...outputDecls].join(
    ', ',
  );

  const internalsDecls = internalsList
    .map(p => getVerilogPortDecl(p, ''))
    .join(';\n    ');
  const internalsBlock = internalsDecls ? `    ${internalsDecls};\n` : '';

  return (
    verilogCodeLine(
      VERILOG_MODULE_HEADER.replace('__NAME__', moduleName) +
        allPortDecls +
        VERILOG_MODULE_FOOTER,
      tabAmount,
      false,
    ) +
    internalsBlock +
    getContent(tabAmount + 1) +
    verilogCodeLine(VERILOG_MODULE_END_FOOTER, tabAmount)
  );
}

function getStateEnumSection(tabAmount: number, nodes: Node<FSMState>[]) {
  const states = getStatesFromNodes(nodes)
    .sort(node => node.data.stateNumber)
    .map(node => getVerilogStateName(node))
    .join(', ');
  const bits = Math.max(
    1,
    Math.ceil(Math.log2(getStatesFromNodes(nodes).length)),
  );
  return (
    verilogCodeLine(
      VERILOG_STATE_ENUM_TYPE.replace('__BITS__', String(bits - 1)) +
        states +
        ' } state_t',
      tabAmount,
    ) + verilogCodeLine(VERILOG_STATE_REG_DECL, tabAmount)
  );
}

function getStateByNodeId(nodes: Node<FSMState>[], nodeId: string) {
  return nodes.find(node => node.id === nodeId);
}

function getVerilogFsmFirstStateName(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstTransition = edges.find(edge => edge.source === RESET_NODE_ID);

  if (firstTransition) {
    const state = getStateByNodeId(nodes, firstTransition.target);
    return state
      ? getVerilogStateName(state)
      : VERILOG_INLINE_COMMENT + VERILOG_RESET_INVALID_ERROR;
  }

  return VERILOG_INLINE_COMMENT + VERILOG_RESET_ERROR;
}

function getVerilogFsmAlwaysFFProcess(
  tabAmount: number,
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstState = getVerilogFsmFirstStateName(nodes, edges);
  return (
    verilogCodeLine('// State Register', tabAmount, false) +
    verilogCodeLine(VERILOG_ALWAYS_FF, tabAmount, false) +
    verilogCodeLine(VERILOG_BEGIN, tabAmount, false) +
    verilogCodeLine(VERILOG_IF_RESET, tabAmount + 1, false) +
    verilogCodeLine(`current_state <= ${firstState};`, tabAmount + 2, false) +
    verilogCodeLine(VERILOG_ELSE, tabAmount + 1, false) +
    verilogCodeLine(`current_state <= next_state;`, tabAmount + 2, false) +
    verilogCodeLine(VERILOG_END, tabAmount + 1, false) +
    verilogCodeLine(VERILOG_END, tabAmount, false)
  );
}

function getVerilogFsmTransitionConditions(
  currentEdges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
): ConditionElement[] {
  const transitionConditions = currentEdges.map((edge): ConditionElement => {
    if (edge.data) {
      const {portLogic, operator} = edge.data;
      const {inputs, internals} = portLogic;

      const inputConditions = Object.keys(inputs).map(inputKey =>
        getVerilogFsmTransitionConditionFromLogic(inputs[inputKey]),
      );

      const internalConditions = Object.keys(internals).map(internalsKey =>
        getVerilogFsmTransitionConditionFromLogic(internals[internalsKey]),
      );

      const allConditions = [...inputConditions, ...internalConditions];
      let portConditionsText = '';
      if (allConditions.length > 0) {
        const joined = allConditions.join(
          operator === LogicalOperator.And ? VERILOG_AND : VERILOG_OR,
        );
        portConditionsText = `(${joined})`;
      }

      const getConditionContent = (contentTab: number) => {
        return getTransitionTargetLine(contentTab, edge.target, allStates);
      };

      return {conditionText: portConditionsText, getConditionContent};
    }

    return {conditionText: '', getConditionContent: () => ''};
  });

  const emptyConditionIndexes = transitionConditions
    .map((cond, idx) => ((cond.conditionText ?? '').trim() === '' ? idx : -1))
    .filter(idx => idx !== -1);

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

function getTransitionTargetLine(
  tabAmount: number,
  targetId: string,
  allStates: Node<FSMState>[],
) {
  const targetState = allStates.find(state => state.id === targetId);

  if (targetState) {
    return verilogCodeLine(
      `next_state <= ${getVerilogStateName(targetState)};`,
      tabAmount,
      false,
    );
  }

  return verilogCodeLine(VERILOG_TRANSITION_ERROR, tabAmount, false, true);
}

function getVerilogFsmTransitionConditionLines(
  tabAmount: number,
  currentEdges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
) {
  const conditions = getVerilogFsmTransitionConditions(currentEdges, allStates);

  return getVerilogConditionSection(tabAmount, conditions);
}

function getVerilogFsmStateTransition(
  tabAmount: number,
  state: Node<FSMState>,
  edges: Edge<FSMTransition>[],
  allStates: Node<FSMState>[],
) {
  const currentEdges = getConnectedEdges([state], edges).filter(
    edge => edge.source === state.id,
  );

  if (currentEdges.length === 0) {
    return verilogCodeLine(
      `next_state <= ${getVerilogStateName(state)};`,
      tabAmount,
      false,
    );
  } else {
    return getVerilogFsmTransitionConditionLines(
      tabAmount,
      currentEdges,
      allStates,
    );
  }
}

function getVerilogFsmStateTransitionProcess(
  tabAmount: number,
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  function getProcessContent(contentTabs: number) {
    const firstState = getVerilogFsmFirstStateName(nodes, edges);
    const states = getStatesFromNodes(nodes);
    const conditions = states.map((state): ConditionElement => {
      return {
        conditionText: getVerilogStateName(state),
        getConditionContent: (tabAmount: number) => {
          return getVerilogFsmStateTransition(tabAmount, state, edges, states);
        },
      };
    });

    let cases = '';
    cases += verilogCodeLine('case (current_state)', contentTabs, false);
    conditions.forEach(cond => {
      cases += verilogCodeLine(
        cond.conditionText + ':',
        contentTabs + 1,
        false,
      );
      cases += cond.getConditionContent(contentTabs + 2);
    });
    cases += verilogCodeLine('default:', contentTabs + 1, false);
    cases += verilogCodeLine(
      `next_state <= ${firstState};`,
      contentTabs + 2,
      false,
    );
    cases += verilogCodeLine('endcase', contentTabs, false);

    return cases;
  }

  return (
    verilogCodeLine('// State Transition Logic', tabAmount, false) +
    verilogCodeLine(VERILOG_ALWAYS_COMB, tabAmount, false) +
    verilogCodeLine(VERILOG_BEGIN, tabAmount, false) +
    getProcessContent(tabAmount + 1) +
    verilogCodeLine(VERILOG_END, tabAmount, false)
  );
}

function getVerilogFsmStateAssignmentLines(
  tabAmount: number,
  portLogic: {
    [key: string]: PortLogic;
  },
) {
  const logicKeys = Object.keys(portLogic);
  if (logicKeys.length === 0) return '';

  return logicKeys
    .map(key =>
      verilogCodeLine(
        getVerilogPortWithRange(portLogic[key]) +
          VERILOG_ASSIGNMENT_ARROW +
          getVerilogPortValue(portLogic[key]),
        tabAmount,
      ),
    )
    .join('');
}

function getVerilogFsmStateAssignments(
  tabAmount: number,
  state: Node<FSMState>,
) {
  const {internals, outputs} = state.data.portLogic;
  const internalLines = getVerilogFsmStateAssignmentLines(tabAmount, internals);
  const outputLines = getVerilogFsmStateAssignmentLines(tabAmount, outputs);

  return internalLines + outputLines;
}

function getVerilogFsmStateAssignmentProcess(
  tabAmount: number,
  outputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
) {
  function getProcessContent(contentTabs: number) {
    // Generate initialization for all ports (outputs and internals) with zero
    const allPorts = [...outputList, ...internalsList];
    const zeroAssignments = allPorts
      .map(port => {
        let zeroValue = "1'b0";
        if (
          port.type === 'logic_vector' &&
          typeof port.defaultValue === 'string'
        ) {
          zeroValue = `${port.defaultValue.length}'b${'0'.repeat(port.defaultValue.length)}`;
        } else if (
          port.type === 'integer' &&
          typeof port.defaultValue === 'number'
        ) {
          zeroValue = '0';
        }
        return verilogCodeLine(
          `${port.id_name} = ${zeroValue}`,
          contentTabs + 2,
        );
      })
      .join('');

    // Generate state assignments for each state
    const states = getStatesFromNodes(nodes);
    let cases = '';
    cases += verilogCodeLine('case (current_state)', contentTabs + 1, false);
    states.forEach(state => {
      const assignment = getVerilogFsmStateAssignments(contentTabs + 3, state);
      if (assignment.trim() !== '') {
        cases += verilogCodeLine(
          getVerilogStateName(state) + ': begin',
          contentTabs + 2,
          false,
        );
        cases += assignment;
        cases += verilogCodeLine('end', contentTabs + 2, false);
      }
    });
    cases += verilogCodeLine('default: begin', contentTabs + 2, false);
    cases += verilogCodeLine(
      VERILOG_DATA_OTHERS_COMMENT,
      contentTabs + 3,
      false,
      true,
    );
    cases += verilogCodeLine('end', contentTabs + 2, false);
    cases += verilogCodeLine('endcase', contentTabs + 1, false);

    return (
      verilogCodeLine(VERILOG_ALWAYS_FF, contentTabs, false) +
      verilogCodeLine(VERILOG_BEGIN, tabAmount, false) +
      verilogCodeLine(VERILOG_IF_RESET, tabAmount + 1, false) +
      zeroAssignments +
      verilogCodeLine(VERILOG_ELSE, tabAmount + 1, false) +
      cases +
      verilogCodeLine(VERILOG_END, tabAmount + 1, false) +
      verilogCodeLine(VERILOG_END, tabAmount, false)
    );
  }

  const commentLine = verilogCodeLine('// Data Logic', tabAmount, false);
  return commentLine + getProcessContent(tabAmount);
}

export function generateVerilogFsmModule(
  tabAmount: number,
  moduleName: string,
  inputList: Port[],
  outputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const getContent = (contentTabs: number) => {
    const stateEnumSection = getStateEnumSection(contentTabs, nodes);
    const alwaysFFProcess = getVerilogFsmAlwaysFFProcess(
      contentTabs,
      nodes,
      edges,
    );
    const stateTransitionProcess = getVerilogFsmStateTransitionProcess(
      contentTabs,
      nodes,
      edges,
    );
    const stateAssignmentProcess = getVerilogFsmStateAssignmentProcess(
      contentTabs,
      outputList,
      internalsList,
      nodes,
    );

    return getStringWithBreakLines([
      stateEnumSection,
      alwaysFFProcess,
      stateTransitionProcess,
      stateAssignmentProcess,
    ]);
  };

  return getModuleSection(
    tabAmount,
    moduleName,
    inputList,
    outputList,
    internalsList,
    getContent,
  );
}
