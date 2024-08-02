import {DEFAULT_INPUT_MAX_LENGTH} from '@constants/input';
import {
  DEFAULT_CLK_PORT,
  DEFAULT_RESET_PORT,
  PortCategory,
} from '@constants/ports.constants';
import {
  VHDL_COLON,
  VHDL_FSM_END_SECTION,
  VHDL_FSM_ENTITY_FOOTER,
  VHDL_FSM_ENTITY_HEADER,
  VHDL_FSM_ENTITY_PORT_HEADER,
  VHDL_IN,
  VHDL_OUT,
  VHDL_SELECTOR_NAME,
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';
import {getXSpaces} from '@utils/transduction';

import {getVhdlInlineComment, vhdlCodeLine} from './utils';

function getPortSection(
  tabAmount: number,
  getContent: (tabAmount: number) => string,
) {
  return (
    vhdlCodeLine(VHDL_FSM_ENTITY_PORT_HEADER, tabAmount, false) +
    getContent(tabAmount + 1) +
    vhdlCodeLine(VHDL_FSM_END_SECTION, tabAmount)
  );
}

function getEntitySection(
  tabAmount: number,
  entityName: string,
  getContent: (tabAmount: number) => string,
) {
  return (
    vhdlCodeLine(
      VHDL_FSM_ENTITY_HEADER.replace(VHDL_SELECTOR_NAME, entityName),
      tabAmount,
      false,
    ) +
    getContent(tabAmount + 1) +
    vhdlCodeLine(
      VHDL_FSM_ENTITY_FOOTER.replace(VHDL_SELECTOR_NAME, entityName),
      tabAmount,
    )
  );
}

function getEntity(
  tabAmount: number,
  entityName: string,
  getContent: (tabAmount: number) => string,
) {
  return getEntitySection(tabAmount, entityName, entityDepth =>
    getPortSection(entityDepth, portDepth => getContent(portDepth)),
  );
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

function getEntityPortCategory(portCategory: PortCategory) {
  return portCategory === 'Output' ? VHDL_OUT : VHDL_IN;
}

function getEntityPortListContent(port: Port, portCategory: PortCategory) {
  return (
    port.id_name +
    getXSpaces(DEFAULT_INPUT_MAX_LENGTH - port.id_name.length) +
    VHDL_COLON +
    getEntityPortCategory(portCategory) +
    getEntityPortType(port) +
    ';' +
    (port.description.length > 0 ? getVhdlInlineComment(port.description) : '')
  );
}

function getEntityPortList(
  tabAmount: number,
  ports: Port[],
  portCategory: PortCategory,
) {
  const portList = ports
    .map(port =>
      vhdlCodeLine(
        getEntityPortListContent(port, portCategory),
        tabAmount,
        false,
      ),
    )
    .join('');

  return portList;
}

export function generateVhdlFsmEntity(
  tabAmount: number,
  entityName: string,
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
) {
  const getContent = (contentTabs: number) => {
    const defaults = getEntityPortList(
      contentTabs,
      [DEFAULT_CLK_PORT, DEFAULT_RESET_PORT],
      'Input',
    );
    const inputs = getEntityPortList(contentTabs, inputList, 'Input');
    const internals = getEntityPortList(contentTabs, internalsList, 'Internal');
    const outputs = getEntityPortList(contentTabs, outputList, 'Output');
    return defaults + inputs + internals + outputs;
  };

  return getEntity(tabAmount, entityName, getContent);
}
