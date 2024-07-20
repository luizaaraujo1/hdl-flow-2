import {DEFAULT_INPUT_MAX_LENGTH} from '@constants/input';
import {
  DEFAULT_CLK_PORT,
  DEFAULT_RESET_PORT,
  PortCategory,
} from '@constants/ports.constants';
import {
  VHDL_FSM_ENTITY_FOOTER,
  VHDL_FSM_ENTITY_HEADER,
  VHDL_FSM_ENTITY_PORT_FOOTER,
  VHDL_FSM_ENTITY_PORT_HEADER,
  VHDL_LINE_COMMENT,
  VHDL_TAB,
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';

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
    VHDL_FSM_ENTITY_HEADER +
    VHDL_FSM_ENTITY_PORT_HEADER +
    content +
    VHDL_FSM_ENTITY_PORT_FOOTER +
    VHDL_FSM_ENTITY_FOOTER
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

export function generateVhdlCode(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
) {
  const imports = generateVhdlImports();
  const entity = generateVhdlFsmEntity(inputList, internalsList, outputList);
  return imports + '\n' + entity;
}
