import {Edge, getConnectedEdges, Node} from 'reactflow';

import {DEFAULT_INPUT_MAX_LENGTH} from '@constants/input';
import {START_NODE_ID} from '@constants/nodes.constants';
import {
  DEFAULT_CLK_PORT,
  DEFAULT_RESET_PORT,
  PortCategory,
} from '@constants/ports.constants';
import {
  VHDL_FSM_ENTITY_FOOTER,
  VHDL_FSM_ENTITY_HEADER,
  VHDL_FSM_END_SECTION,
  VHDL_FSM_ENTITY_PORT_HEADER,
  VHDL_LINE_COMMENT,
  VHDL_TAB,
  VHDL_FSM_ARCHITECTURE_HEADER,
  VHDL_FSM_ARCHITECTURE_TYPE,
  VHDL_FSM_ARCHITECTURE_SIGNALS,
  VHDL_BEGIN,
  VHDL_BEGIN_PROCESS,
  VHDL_FSM_CLOCK_PROCESS_LINE_1,
  VHDL_FSM_CLOCK_PROCESS_LINE_2,
  VHDL_FSM_CLOCK_PROCESS_LINE_3,
  VHDL_FSM_CLOCK_PROCESS_LINE_4,
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
  VHDL_FSM_STATE_PROCESS_INTERNALS_COMMENT,
  VHDL_FSM_STATE_PROCESS_OUTPUTS_COMMENT,
  VHDL_FSM_STATE_PROCESS_DEAD_COMMENT,
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';
import FSMState, {LogicType, PortLogic} from '@models/state';
import FSMTransition, {LogicalOperator} from '@models/transition';

function getNSpaces(amount: number) {
  return ' '.repeat(amount);
}

function getNTabs(amount: number) {
  return VHDL_TAB.repeat(amount);
}

function getVhdlCommentLine(comment: string) {
  return getNTabs(VHDL_TAB_DEPTH.ONE_TAB) + VHDL_LINE_COMMENT + comment;
}

function vhdlCodeLine(
  content: string,
  tabDepth = VHDL_TAB_DEPTH.NO_TAB,
  hasSemicolon = true,
  commented = false,
) {
  return (
    getNTabs(tabDepth) +
    (commented ? VHDL_LINE_COMMENT : '') +
    content +
    (hasSemicolon ? ';' : '') +
    '\n'
  );
}

function generateVhdlImports() {
  return (
    vhdlCodeLine(
      'Resulting VHDL code from HDL Flow',
      VHDL_TAB_DEPTH.NO_TAB,
      true,
      true,
    ) +
    vhdlCodeLine('library IEEE') +
    vhdlCodeLine('use IEEE.std_logic_1164.all')
  );
}

function getEntityPortCategory(portCategory: PortCategory) {
  return portCategory === 'Output' ? 'out' : 'in';
}

function getEntityPortType(port: Port) {
  switch (port.type) {
    case PortTypeEnum.LogicVector:
      return (
        'std_logic_vector(' +
        String(String(port.defaultValue).length - 1) +
        ' downto 0)'
      );
    case PortTypeEnum.Logic:
      return 'std_logic';
    case PortTypeEnum.Integer:
    default:
      return 'std_logic_vector(8 downto 0)';
  }
}

function getEntityPortListContent(port: Port, portCategory: PortCategory) {
  return (
    port.id_name +
    getNSpaces(DEFAULT_INPUT_MAX_LENGTH - port.id_name.length) +
    ': ' +
    getEntityPortCategory(portCategory) +
    ' ' +
    getEntityPortType(port) +
    (port.description.length > 0 ? getVhdlCommentLine(port.description) : '')
  );
}

function getEntityPortList(ports: Port[], portCategory: PortCategory) {
  const portList = ports
    .map(port =>
      vhdlCodeLine(
        getEntityPortListContent(port, portCategory),
        VHDL_TAB_DEPTH.TWO_TABS,
      ),
    )
    .join('');

  return portList;
}

function getWrappedVhdlFsmEntityContent(content: string) {
  return (
    vhdlCodeLine(VHDL_FSM_ENTITY_HEADER, VHDL_TAB_DEPTH.NO_TAB, false) +
    vhdlCodeLine(VHDL_FSM_ENTITY_PORT_HEADER, VHDL_TAB_DEPTH.ONE_TAB, false) +
    content +
    vhdlCodeLine(VHDL_FSM_END_SECTION, VHDL_TAB_DEPTH.ONE_TAB) +
    vhdlCodeLine(VHDL_FSM_ENTITY_FOOTER)
  );
}

function generateVhdlFsmEntity(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
) {
  const defaults = getEntityPortList(
    [DEFAULT_CLK_PORT, DEFAULT_RESET_PORT],
    'Input',
  );
  const inputs = getEntityPortList(inputList, 'Input');
  const internals = getEntityPortList(internalsList, 'Internal');
  const outputs = getEntityPortList(outputList, 'Output');
  const content = inputs + internals + outputs;
  return getWrappedVhdlFsmEntityContent(defaults + content);
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

function getVhdlFsmArchitectureDefinitions(nodes: Node<FSMState>[]) {
  const stateList = getVhdlArchitectureStateList(nodes);

  return (
    vhdlCodeLine(
      VHDL_FSM_ARCHITECTURE_TYPE + stateList + VHDL_FSM_END_SECTION,
      VHDL_TAB_DEPTH.ONE_TAB,
    ) + vhdlCodeLine(VHDL_FSM_ARCHITECTURE_SIGNALS, VHDL_TAB_DEPTH.ONE_TAB)
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
      : VHDL_LINE_COMMENT + 'Error! Start node connection is invalid';
  }
  return VHDL_LINE_COMMENT + 'Error! Start node is not connected to anything';
}

function getVhdlFsmArchitectureClockProcess(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const clockProcessPortList = [DEFAULT_CLK_PORT, DEFAULT_RESET_PORT]
    .map(port => port.id_name)
    .join(', ');
  const firstState = getVhdlFsmFirstStateName(nodes, edges);

  return (
    vhdlCodeLine(
      VHDL_BEGIN_PROCESS + clockProcessPortList + VHDL_FSM_END_SECTION,
      VHDL_TAB_DEPTH.ONE_TAB,
      false,
      false,
    ) +
    vhdlCodeLine(VHDL_BEGIN, VHDL_TAB_DEPTH.ONE_TAB, false) +
    vhdlCodeLine(
      VHDL_FSM_CLOCK_PROCESS_LINE_1,
      VHDL_TAB_DEPTH.TWO_TABS,
      false,
    ) +
    vhdlCodeLine(
      VHDL_FSM_CLOCK_PROCESS_LINE_2 + firstState,
      VHDL_TAB_DEPTH.THREE_TABS,
    ) +
    vhdlCodeLine(
      VHDL_FSM_CLOCK_PROCESS_LINE_3,
      VHDL_TAB_DEPTH.TWO_TABS,
      false,
    ) +
    vhdlCodeLine(VHDL_FSM_CLOCK_PROCESS_LINE_4, VHDL_TAB_DEPTH.THREE_TABS) +
    vhdlCodeLine(VHDL_END_IF, VHDL_TAB_DEPTH.TWO_TABS, false) +
    vhdlCodeLine(VHDL_END_PROCESS, VHDL_TAB_DEPTH.ONE_TAB)
  );
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

function getVhdlFsmArchitecturePortLogicAssignment(portLogic: PortLogic) {
  const assignment =
    portLogic.port.id_name +
    VHDL_ASSIGNMENT_ARROW +
    getVhdlFsmArchitecturePortValue(portLogic);
  return vhdlCodeLine(assignment, VHDL_TAB_DEPTH.FOUR_TABS);
}

function getVhdlFsmArchitectureStateAssignmentLines(portLogic: {
  [key: string]: PortLogic;
}) {
  const logicKeys = Object.keys(portLogic);
  if (logicKeys.length === 0) return '';
  return logicKeys
    .map(key => getVhdlFsmArchitecturePortLogicAssignment(portLogic[key]))
    .join('');
}

function getVhdlFsmArchitectureStateAssignments(state: Node<FSMState>) {
  const {internals, outputs} = state.data.portLogic;
  let internalLines = getVhdlFsmArchitectureStateAssignmentLines(internals);
  let outputLines = getVhdlFsmArchitectureStateAssignmentLines(outputs);
  if (internalLines === '')
    internalLines = vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_INTERNALS_COMMENT,
      VHDL_TAB_DEPTH.FOUR_TABS,
      false,
      true,
    );
  if (outputLines === '')
    outputLines = vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_OUTPUTS_COMMENT,
      VHDL_TAB_DEPTH.FOUR_TABS,
      false,
      true,
    );
  return internalLines + outputLines;
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

function getVhdlAndOperationAndCondition(edge: Edge<FSMTransition>) {
  if (edge.data) {
    const {portLogic} = edge.data;
    const {inputs, internals} = portLogic;
    const inputKeys = Object.keys(inputs);
    const internalKeys = Object.keys(internals);

    return (
      inputKeys.map(inputKey => inputs[inputKey].customValue).join('') +
      internalKeys
        .map(internalKey => internals[internalKey].customValue)
        .join('')
    );
  }
  return '';
}

function getVhdlAndOperationOrConditionLines(
  edge: Edge<FSMTransition>,
  isFirst: boolean,
) {
  console.log('🚀 ~ isFirst:', isFirst);
  if (edge.data) {
    return '';
  }
  return '';
}

function getVhdlFsmArchitectureStateTransitionConditionLines(
  state: Node<FSMState>,
  currentEdges: Edge<FSMTransition>[],
) {
  const elseCase = getVhdlFsmArchitectureStateTransitionElseCase(state);

  if (currentEdges.length === 0) {
    return (
      vhdlCodeLine(
        VHDL_FSM_STATE_PROCESS_DEAD_COMMENT,
        VHDL_TAB_DEPTH.FOUR_TABS,
        false,
        true,
      ) + elseCase
    );
  } else {
    return currentEdges
      .map((edge, index) => {
        const isFirst = index === 0;
        const lineText = isFirst ? VHDL_IF : VHDL_ELSIF;
        if (edge.data) {
          if (edge.data.operator === LogicalOperator.And) {
            const condition = getVhdlAndOperationAndCondition(edge);
            return vhdlCodeLine(
              lineText + condition + VHDL_THEN,
              VHDL_TAB_DEPTH.FOUR_TABS,
              false,
            );
          } else {
            return getVhdlAndOperationOrConditionLines(edge, isFirst);
          }
        }
      })
      .join('');
  }
}

function getVhdlFsmArchitectureStateTransition(
  state: Node<FSMState>,
  edges: Edge<FSMTransition>[],
) {
  const currentEdges = getConnectedEdges([state], edges).filter(
    edge => edge.source === state.id,
  );

  if (currentEdges.length === 0) {
    return vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + getVhdlStateName(state),
      VHDL_TAB_DEPTH.FOUR_TABS,
    );
  } else {
    return getVhdlFsmArchitectureStateTransitionConditionLines(
      state,
      currentEdges,
    );
  }
}

function getVhdlFsmArchitectureStateCase(
  state: Node<FSMState>,
  edges: Edge<FSMTransition>[],
) {
  const definitions = getVhdlFsmArchitectureStateAssignments(state);
  const transition = getVhdlFsmArchitectureStateTransition(state, edges);
  const whenLine = VHDL_WHEN + getVhdlStateName(state) + VHDL_DEFINITION_ARROW;

  return (
    vhdlCodeLine(whenLine, VHDL_TAB_DEPTH.THREE_TABS, false) +
    definitions +
    '\n' +
    transition
  );
}

function getVhdlFsmArchitectureStateProcessCases(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstState = getVhdlFsmFirstStateName(nodes, edges);
  const states = getStatesFromNodes(nodes);
  const stateCases = states
    .map(state => getVhdlFsmArchitectureStateCase(state, edges))
    .join('\n');

  return (
    stateCases +
    vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_WHEN_OTHERS,
      VHDL_TAB_DEPTH.THREE_TABS,
      false,
    ) +
    vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT,
      VHDL_TAB_DEPTH.FOUR_TABS,
      false,
      true,
    ) +
    vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + firstState,
      VHDL_TAB_DEPTH.FOUR_TABS,
    )
  );
}

function getVhdlFsmArchitectureStateProcessCaseSection(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const cases = getVhdlFsmArchitectureStateProcessCases(nodes, edges);

  return (
    vhdlCodeLine(
      VHDL_FSM_STATE_PROCESS_HEADER,
      VHDL_TAB_DEPTH.TWO_TABS,
      false,
    ) +
    cases +
    vhdlCodeLine(VHDL_FSM_STATE_PROCESS_FOOTER, VHDL_TAB_DEPTH.TWO_TABS)
  );
}

function getVhdlFsmArchitectureStateProcess(
  inputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const stateProcessPortList = [
    ...inputList.map(input => input.id_name),
    ...internalsList.map(internal => internal.id_name),
  ].join(', ');
  const caseSection = getVhdlFsmArchitectureStateProcessCaseSection(
    nodes,
    edges,
  );

  return (
    vhdlCodeLine(
      VHDL_BEGIN_PROCESS + stateProcessPortList + VHDL_FSM_END_SECTION,
      VHDL_TAB_DEPTH.ONE_TAB,
      false,
      false,
    ) +
    vhdlCodeLine(VHDL_BEGIN, VHDL_TAB_DEPTH.ONE_TAB, false) +
    caseSection +
    vhdlCodeLine(VHDL_END_PROCESS, 1)
  );
}

function generateVhdlFsmArchitecture(
  inputList: Port[],
  internalsList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const definitions = getVhdlFsmArchitectureDefinitions(nodes);
  const clockProcess = getVhdlFsmArchitectureClockProcess(nodes, edges);
  const stateProcess = getVhdlFsmArchitectureStateProcess(
    inputList,
    internalsList,
    nodes,
    edges,
  );

  return (
    vhdlCodeLine(VHDL_FSM_ARCHITECTURE_HEADER, VHDL_TAB_DEPTH.NO_TAB, false) +
    definitions +
    vhdlCodeLine(VHDL_BEGIN, VHDL_TAB_DEPTH.NO_TAB, false) +
    clockProcess +
    '\n' +
    stateProcess +
    vhdlCodeLine(VHDL_FSM_ARCHITECTURE_FOOTER, VHDL_TAB_DEPTH.NO_TAB)
  );
}

export function generateVhdlCode(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const imports = generateVhdlImports();
  const entity = generateVhdlFsmEntity(inputList, internalsList, outputList);
  const architecture = generateVhdlFsmArchitecture(
    inputList,
    internalsList,
    nodes,
    edges,
  );

  return imports + '\n' + entity + '\n' + architecture;
}
