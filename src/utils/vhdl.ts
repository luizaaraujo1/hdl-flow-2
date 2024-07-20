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
  VHDL_FSM_STATE_PROCESS_LINE_1,
  VHDL_FSM_STATE_PROCESS_LINE_2,
  VHDL_FSM_STATE_PROCESS_LINE_3,
  VHDL_FSM_STATE_PROCESS_LINE_4,
  VHDL_FSM_STATE_PROCESS_LINE_5,
  VHDL_END_PROCESS,
  VHDL_STATE_PREFIX,
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';

export function getNSpaces(ammount: number) {
  return ' '.repeat(ammount);
}

export function getNTabs(ammount: number) {
  return VHDL_TAB.repeat(ammount);
}

export function getVhdlCommentLine(comment: string) {
  return getNTabs(1) + VHDL_LINE_COMMENT + comment;
}

export function getVhdlCodeLine(
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

export function generateVhdlImports() {
  return (
    getVhdlCodeLine('Resulting VHDL code from HDL Flow', 0, true, true) +
    getVhdlCodeLine('library IEEE') +
    getVhdlCodeLine('use IEEE.std_logic_1164.all')
  );
}

export function getEntityPortCategory(portCategory: PortCategory) {
  return portCategory === 'Output' ? 'out' : 'in';
}

export function getEntityPortType(port: Port) {
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

export function getEntityPortList(ports: Port[], portCategory: PortCategory) {
  const portList = ports
    .map(port =>
      getVhdlCodeLine(getEntityPortListContent(port, portCategory), 2),
    )
    .join('');
  return portList;
}

export function getWrappedVhdlFsmEntityContent(content: string) {
  return (
    getVhdlCodeLine(VHDL_FSM_ENTITY_HEADER, 0, false) +
    getVhdlCodeLine(VHDL_FSM_ENTITY_PORT_HEADER, 1, false) +
    content +
    getVhdlCodeLine(VHDL_FSM_END_SECTION, 1) +
    getVhdlCodeLine(VHDL_FSM_ENTITY_FOOTER)
  );
}

export function generateVhdlFsmEntity(
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

function getVhdlArchitectureStateList(nodes: Node<FSMState>[]) {
  return nodes
    .filter(node => node.id !== START_NODE_ID)
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

function getVhdlFsmArchitectureClockProcess(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const clockProcessPortList = [DEFAULT_CLK_PORT, DEFAULT_RESET_PORT]
    .map(port => port.id_name)
    .join(', ');
  const firstTransition = edges.find(edge => edge.source === START_NODE_ID);
  const firstState = firstTransition
    ? getVhdlStateName(
        getStateByNodeId(nodes, firstTransition.target)?.data.stateNumber ?? 0,
      )
    : VHDL_LINE_COMMENT + 'Error! Start node is not connected to anything';
  return (
    getVhdlCodeLine(
      VHDL_BEGIN_PROCESS + clockProcessPortList + VHDL_FSM_END_SECTION,
      1,
      false,
      false,
    ) +
    getVhdlCodeLine(VHDL_BEGIN, 1, false) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_LINE_1, 2, false) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_LINE_2 + firstState, 3) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_LINE_3, 2, false) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_LINE_4, 3) +
    getVhdlCodeLine(VHDL_FSM_STATE_PROCESS_LINE_5, 2, false) +
    getVhdlCodeLine(VHDL_END_PROCESS, 1)
  );
}

function generateVhdlFsmArchitecture(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  const definitions = getVhdlFsmArchitectureDefinitions(nodes);
  const clockProcess = getVhdlFsmArchitectureClockProcess(nodes, edges);
  return (
    getVhdlCodeLine(VHDL_FSM_ARCHITECTURE_HEADER, 0, false) +
    definitions +
    getVhdlCodeLine(VHDL_BEGIN, 0, false) +
    clockProcess
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
  const architecture = generateVhdlFsmArchitecture(nodes, edges);
  return imports + '\n' + entity + '\n' + architecture;
}
