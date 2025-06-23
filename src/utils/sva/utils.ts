import {Node} from 'reactflow';

import {RESET_NODE_ID} from '@constants/nodes.constants';
import {
  VERILOG_AND,
  VERILOG_BEGIN,
  VERILOG_COMMENT_SPACING_SIZE,
  VERILOG_ELSE,
  VERILOG_ELSE_IF,
  VERILOG_END,
  VERILOG_IF,
  VERILOG_INLINE_COMMENT,
  VERILOG_NAND,
  VERILOG_NOR,
  VERILOG_OR,
  VERILOG_STATE_PREFIX,
  VERILOG_TAB_SIZE,
  VERILOG_XNOR,
  VERILOG_XOR,
} from '@constants/verilog';
import Port, {PortTypeEnum} from '@models/port';
import FSMState, {
  ExpressionItem,
  LogicType,
  logicTypeToVerilogOperator,
  logicTypeToVhdlOperator,
  PortLogic,
} from '@models/state';
import {ConditionElement} from '@models/transduction';
import {
  getConditionSection,
  getInlineComment,
  getXTabs,
} from '@utils/transduction';

export function getVerilogXTabs(amount: number) {
  return getXTabs(amount, VERILOG_TAB_SIZE);
}

export function getVerilogInlineComment(comment: string) {
  return getInlineComment(
    comment,
    VERILOG_COMMENT_SPACING_SIZE,
    VERILOG_INLINE_COMMENT,
  );
}

export function verilogCodeLine(
  content: string,
  tabDepth = 0,
  hasSemicolon = true,
  commented = false,
) {
  return (
    getVerilogXTabs(tabDepth) +
    (commented ? VERILOG_INLINE_COMMENT : '') +
    content +
    (hasSemicolon ? ';' : '') +
    '\n'
  );
}

export function getVerilogConditionSection(
  tabAmount: number,
  conditions: ConditionElement[],
) {
  return getConditionSection(
    tabAmount,
    getVerilogXTabs(tabAmount) + VERILOG_IF,
    getVerilogXTabs(tabAmount) + VERILOG_ELSE_IF,
    getVerilogXTabs(tabAmount) + VERILOG_ELSE,
    ' ' + VERILOG_BEGIN + '\n',
    verilogCodeLine(VERILOG_END, tabAmount, false),
    conditions,
  );
}

function getVerilogOperator(op?: string) {
  switch (op) {
    case '+':
    case '-':
    case '*':
    case '/':
    case '<<':
    case '>>':
      return ` ${op} `;
    case 'AND':
      return VERILOG_AND;
    case 'OR':
      return VERILOG_OR;
    case 'NAND':
      return VERILOG_NAND;
    case 'NOR':
      return VERILOG_NOR;
    case 'XOR':
      return VERILOG_XOR;
    case 'XNOR':
      return VERILOG_XNOR;
    default:
      return op ? ` ${op} ` : ' ';
  }
}

export function getVerilogPortWithRange(item: ExpressionItem | PortLogic) {
  const portName = (item as any).port.id_name
    ? (item as any).port.id_name
    : item.port;
  const from = (item as any).from;
  const to = (item as any).to;
  if (from !== undefined && to !== undefined && from !== '' && to !== '') {
    return `${portName}[${from}:${to}]`;
  }
  return portName;
}

function getVerilogPortExpressionItem(
  item: ExpressionItem,
  idx: number,
  portType: PortTypeEnum,
) {
  let portStr = getVerilogPortWithRange(item);

  const isManualValue =
    ![...Object.values(PortTypeEnum)].some(type => portStr.startsWith(type)) &&
    !isNaN(Number(item.port));
  if (
    portType === PortTypeEnum.Logic &&
    isManualValue &&
    !/^'.*'$/.test(portStr)
  ) {
    portStr = `'${item.port}'`;
  }

  if (idx === 0) return portStr;
  return `${getVerilogOperator(item.operator)}${portStr}`;
}

export function getVerilogPortValue(portLogic: PortLogic) {
  const portType = portLogic.port.type;

  switch (portLogic.type) {
    case LogicType.Equality:
    case LogicType.Inequality:
    case LogicType.LessThan:
    case LogicType.LessThanOrEqual:
    case LogicType.GreaterThan:
    case LogicType.GreaterThanOrEqual: {
      if (portLogic.expression && portLogic.expression.length === 1) {
        return getVerilogPortExpressionItem(
          portLogic.expression[0],
          0,
          portType,
        );
      }
      if (portLogic.expression && portLogic.expression.length > 0) {
        return portLogic.expression
          .map((item, idx) => getVerilogPortExpressionItem(item, idx, portType))
          .join('');
      }
      return portLogic.customValue;
    }
    case LogicType.Custom:
      return portLogic.customValue;
    case LogicType.Default:
    default:
      return getVerilogPortDefaultValue(portLogic.port);
  }
}

export function getVerilogPortDefaultValue(port: Port) {
  switch (port.type) {
    case PortTypeEnum.Logic:
      return port.defaultValue ? "1'b1" : "1'b0";
    case PortTypeEnum.Integer:
      return String(Number(port.defaultValue));
    case PortTypeEnum.LogicVector:
      return String(port.defaultValue);
  }
}

export function getVerilogFsmTransitionConditionFromLogic(
  portLogic: PortLogic,
) {
  let portName = getVerilogPortWithRange(portLogic);
  // Special handling for equality with 1 or 0
  if (
    portLogic.type === LogicType.Equality &&
    portLogic.expression &&
    portLogic.expression.length === 1
  ) {
    const expr = portLogic.expression[0];
    if (expr.port === '1' || expr.port === "1'b1") {
      return portName;
    }
    if (expr.port === '0' || expr.port === "1'b0") {
      return '!' + portName;
    }
  }

  const portValue = getVerilogPortValue(portLogic);

  return portName + logicTypeToVerilogOperator(portLogic.type) + portValue;
}

export function getVerilogStateName(state: Node<FSMState>) {
  return VERILOG_STATE_PREFIX + state.data.stateNumber;
}

export function getStatesFromNodes(nodes: Node<FSMState>[]) {
  return nodes
    .filter(node => node.id !== RESET_NODE_ID)
    .sort((a, b) => a.data.stateNumber - b.data.stateNumber);
}

export function getDisplayFsmTransitionConditionFromLogic(
  portLogic: PortLogic,
) {
  let portName = getVerilogPortWithRange(portLogic);

  let value = '';
  if (portLogic.expression && portLogic.expression.length > 0) {
    value = portLogic.expression.map(item => item.port).join('');
  } else if (portLogic.customValue) {
    value = String(portLogic.customValue);
  } else {
    value = String(portLogic.port.defaultValue ?? '');
  }

  const op = logicTypeToVhdlOperator(portLogic.type);

  return `${portName}${op}${value}`;
}
