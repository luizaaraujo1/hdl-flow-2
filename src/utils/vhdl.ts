import {Edge, Node} from 'reactflow';

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
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';

function getNSpaces(amount: number) {
  return ' '.repeat(amount);
}

function getNTabs(amount: number) {
  return VHDL_TAB.repeat(amount);
}

function getVhdlCommentLine(comment: string) {
  return getNTabs(1) + VHDL_LINE_COMMENT + comment;
}

function getVhdlCodeLine(
  content: string,
  tabDepth = 0,
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
    getVhdlCodeLine('Resulting VHDL code from HDL Flow', 0, true, true) +
    getVhdlCodeLine('library IEEE') +
    getVhdlCodeLine('use IEEE.std_logic_1164.all')
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
      getVhdlCodeLine(getEntityPortListContent(port, portCategory), 2),
    )
    .join('');

  return portList;
}

function getWrappedVhdlFsmEntityContent(content: string) {
  return (
    getVhdlCodeLine(VHDL_FSM_ENTITY_HEADER, 0, false) +
    getVhdlCodeLine(VHDL_FSM_ENTITY_PORT_HEADER, 1, false) +
    content +
    getVhdlCodeLine(VHDL_FSM_END_SECTION, 1) +
    getVhdlCodeLine(VHDL_FSM_ENTITY_FOOTER)
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

function getVhdlStateName(stateNumber: number) {
  return VHDL_STATE_PREFIX + stateNumber;
}

function getStatesFromNodes(nodes: Node<FSMState>[]) {
  return nodes.filter(node => node.id !== START_NODE_ID);
}

function getVhdlArchitectureStateList(nodes: Node<FSMState>[]) {
  return getStatesFromNodes(nodes)
    .sort(node => node.data.stateNumber)
    .map(node => getVhdlStateName(node.data.stateNumber))
    .join(', ');
}

function getVhdlFsmArchitectureDefinitions(nodes: Node<FSMState>[]) {
  const stateList = getVhdlArchitectureStateList(nodes);

  return (
    getVhdlCodeLine(
      VHDL_FSM_ARCHITECTURE_TYPE + stateList + VHDL_FSM_END_SECTION,
      1,
    ) + getVhdlCodeLine(VHDL_FSM_ARCHITECTURE_SIGNALS, 1)
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
  return firstTransition
    ? getVhdlStateName(
        getStateByNodeId(nodes, firstTransition.target)?.data.stateNumber ?? 0,
      )
    : VHDL_LINE_COMMENT + 'Error! Start node is not connected to anything';
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
    getVhdlCodeLine(
      VHDL_BEGIN_PROCESS + clockProcessPortList + VHDL_FSM_END_SECTION,
      1,
      false,
      false,
    ) +
    getVhdlCodeLine(VHDL_BEGIN, 1, false) +
    getVhdlCodeLine(VHDL_FSM_CLOCK_PROCESS_LINE_1, 2, false) +
    getVhdlCodeLine(VHDL_FSM_CLOCK_PROCESS_LINE_2 + firstState, 3) +
    getVhdlCodeLine(VHDL_FSM_CLOCK_PROCESS_LINE_3, 2, false) +
    getVhdlCodeLine(VHDL_FSM_CLOCK_PROCESS_LINE_4, 3) +
    getVhdlCodeLine(VHDL_END_IF, 2, false) +
    getVhdlCodeLine(VHDL_END_PROCESS, 1)
  );
}

function getVhdlFsmArchitectureStateAssignments() {
  return '';
}

function getVhdlFsmArchitectureStateTransition() {
  return '';
}

function getVhdlFsmArchitectureStateCase(state: Node<FSMState>) {
  const definitions = getVhdlFsmArchitectureStateAssignments();
  const transition = getVhdlFsmArchitectureStateTransition();
  const whenLine =
    VHDL_WHEN +
    getVhdlStateName(state.data.stateNumber) +
    VHDL_DEFINITION_ARROW;

  return getVhdlCodeLine(whenLine, 3, false) + definitions + '\n' + transition;
}

function getVhdlFsmArchitectureStateProcessCases(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const firstState = getVhdlFsmFirstStateName(nodes, edges);
  const states = getStatesFromNodes(nodes);

  return (
    states.map(state => getVhdlFsmArchitectureStateCase(state)).join('\n') +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_WHEN_OTHERS, 3, false) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_DEFAULT_COMMENT, 4, false, true) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_NEXT_STATE_ASSIGN + firstState, 4)
  );
}

function getVhdlFsmArchitectureStateProcessCaseSection(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const cases = getVhdlFsmArchitectureStateProcessCases(nodes, edges);

  return (
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_HEADER, 2, false) +
    cases +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_FOOTER, 2)
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
    getVhdlCodeLine(
      VHDL_BEGIN_PROCESS + stateProcessPortList + VHDL_FSM_END_SECTION,
      1,
      false,
      false,
    ) +
    getVhdlCodeLine(VHDL_BEGIN, 1, false) +
    caseSection +
    getVhdlCodeLine(VHDL_END_PROCESS, 1)
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
    getVhdlCodeLine(VHDL_FSM_ARCHITECTURE_HEADER, 0, false) +
    definitions +
    getVhdlCodeLine(VHDL_BEGIN, 0, false) +
    clockProcess +
    '\n' +
    stateProcess +
    getVhdlCodeLine(VHDL_FSM_ARCHITECTURE_FOOTER, 0)
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
