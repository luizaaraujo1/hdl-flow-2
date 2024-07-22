import {Node} from 'reactflow';

import {START_NODE_ID} from '@constants/nodes.constants';
import {
  VHDL_COMMENT_SPACING_SIZE,
  VHDL_ELSE,
  VHDL_ELSIF,
  VHDL_END_IF,
  VHDL_EQUALITY,
  VHDL_IF,
  VHDL_INEQUALITY,
  VHDL_INLINE_COMMENT,
  VHDL_STATE_PREFIX,
  VHDL_TAB_SIZE,
  VHDL_THEN,
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';
import FSMState, {LogicType, PortLogic} from '@models/state';
import {ConditionElement} from '@models/transduction';
import {
  getConditionSection,
  getInlineComment,
  getXTabs,
} from '@utils/transduction';

export function getVhdlXTabs(amount: number) {
  return getXTabs(amount, VHDL_TAB_SIZE);
}

export function getVhdlInlineComment(comment: string) {
  return getInlineComment(
    comment,
    VHDL_COMMENT_SPACING_SIZE,
    VHDL_INLINE_COMMENT,
  );
}

export function vhdlCodeLine(
  content: string,
  tabDepth = 0,
  hasSemicolon = true,
  commented = false,
) {
  return (
    getVhdlXTabs(tabDepth) +
    (commented ? VHDL_INLINE_COMMENT : '') +
    content +
    (hasSemicolon ? ';' : '') +
    '\n'
  );
}

export function getVhdlConditionSection(
  tabAmount: number,
  conditions: ConditionElement[],
) {
  return getConditionSection(
    tabAmount,
    getVhdlXTabs(tabAmount) + VHDL_IF,
    getVhdlXTabs(tabAmount) + VHDL_ELSIF,
    getVhdlXTabs(tabAmount) + VHDL_ELSE,
    VHDL_THEN + '\n',
    vhdlCodeLine(VHDL_END_IF, tabAmount),
    conditions,
  );
}

export function getVhdlPortValue(portLogic: PortLogic) {
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
      return getVhdlPortDefaultValue(portLogic.port);
  }
}

export function getVhdlPortDefaultValue(port: Port) {
  switch (port.type) {
    case PortTypeEnum.Logic:
      return port.defaultValue ? "'1'" : "'0'";
    case PortTypeEnum.Integer:
      return '"' + Number(port.defaultValue).toString(2) + '"';
    case PortTypeEnum.LogicVector:
      return '"' + String(port.defaultValue) + '"';
  }
}

export function getVhdlFsmTransitionConditionFromLogic(portLogic: PortLogic) {
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

export function getVhdlStateName(state: Node<FSMState>) {
  return VHDL_STATE_PREFIX + state.data.stateNumber;
}

export function getStatesFromNodes(nodes: Node<FSMState>[]) {
  return nodes.filter(node => node.id !== START_NODE_ID);
}
