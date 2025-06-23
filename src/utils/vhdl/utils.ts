import {Node} from 'reactflow';

import {RESET_NODE_ID} from '@constants/nodes.constants';
import {
  VHDL_AND,
  VHDL_COMMENT_SPACING_SIZE,
  VHDL_ELSE,
  VHDL_ELSIF,
  VHDL_END_IF,
  VHDL_IF,
  VHDL_INLINE_COMMENT,
  VHDL_NAND,
  VHDL_NOR,
  VHDL_OR,
  VHDL_SLL,
  VHDL_SRL,
  VHDL_STATE_PREFIX,
  VHDL_TAB_SIZE,
  VHDL_THEN,
  VHDL_XNOR,
  VHDL_XOR,
} from '@constants/vhdl';
import Port, {PortTypeEnum} from '@models/port';
import FSMState, {
  ExpressionItem,
  LogicType,
  logicTypeToVhdlOperator,
  PortLogic,
} from '@models/state';
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

function getVhdlOperator(op?: string) {
  switch (op) {
    case '+':
    case '-':
    case '*':
    case '/':
      return ` ${op} `;
    case '<<':
      return VHDL_SLL;
    case '>>':
      return VHDL_SRL;
    case 'AND':
      return VHDL_AND;
    case 'OR':
      return VHDL_OR;
    case 'NAND':
      return VHDL_NAND;
    case 'NOR':
      return VHDL_NOR;
    case 'XOR':
      return VHDL_XOR;
    case 'XNOR':
      return VHDL_XNOR;
    default:
      return op ? ` ${op} ` : ' ';
  }
}

function getVhdlPortWithRange(item: ExpressionItem) {
  if (
    item.from !== undefined &&
    item.to !== undefined &&
    item.from !== '' &&
    item.to !== ''
  ) {
    return `${item.port}(${item.from} downto ${item.to})`;
  }
  return item.port;
}

function getVhdlPortExpressionItem(
  item: ExpressionItem,
  idx: number,
  portType: PortTypeEnum,
) {
  let portStr = getVhdlPortWithRange(item);

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
  return `${getVhdlOperator(item.operator)}${portStr}`;
}

function isVhdlVectorArithmeticOp(operator?: string): boolean {
  return (
    operator === '<<' ||
    operator === '>>' ||
    operator === '+' ||
    operator === '-' ||
    operator === '*' ||
    operator === '/'
  );
}

export function getVhdlPortValue(portLogic: PortLogic) {
  const portType = portLogic.port.type;

  switch (portLogic.type) {
    case LogicType.Equality:
    case LogicType.Inequality:
    case LogicType.LessThan:
    case LogicType.LessThanOrEqual:
    case LogicType.GreaterThan:
    case LogicType.GreaterThanOrEqual: {
      if (portLogic.expression && portLogic.expression.length === 1) {
        return getVhdlPortExpressionItem(portLogic.expression[0], 0, portType);
      }
      if (portLogic.expression && portLogic.expression.length > 0) {
        // Check if the expression uses unsigned operators and logic_vector
        const usesVectorOp = portLogic.expression.some(
          item =>
            isVhdlVectorArithmeticOp(item.operator) &&
            portType === PortTypeEnum.LogicVector,
        );

        if (usesVectorOp) {
          // Build the conversion to support unsigned operations in vectors
          // e.g. sig sll 1 -> std_logic_vector(unsigned(sig) sll 1)
          let expr = portLogic.expression
            .map((item, idx) => {
              let portStr = getVhdlPortWithRange(item);

              // For the first item, wrap in unsigned() if next is arithmetic/shift
              if (
                idx === 0 &&
                portLogic.expression &&
                isVhdlVectorArithmeticOp(portLogic.expression[1]?.operator)
              ) {
                return `unsigned(${portStr})`;
              }
              // Add operator and following value
              if (idx > 0) {
                return `${getVhdlOperator(item.operator)}${portStr}`;
              }
              return portStr;
            })
            .join('');
          // Wrap the whole expression in std_logic_vector(...)
          return `std_logic_vector(${expr})`;
        }

        // Default behavior for other operators
        return portLogic.expression
          .map((item, idx) => getVhdlPortExpressionItem(item, idx, portType))
          .join('');
      }
      return portLogic.customValue;
    }
    case LogicType.Custom:
      return portLogic.customValue;
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
  const portType = portLogic.port.type;
  const portValue = getVhdlPortValue(portLogic);

  // Check for comparison with manual value and logic_vector type
  if (
    portType === PortTypeEnum.LogicVector &&
    !isNaN(Number(portValue)) &&
    portLogic.expression
  ) {
    // If right is a manual value (number), convert left to unsigned(...)
    let outputPort = portLogic.port.id_name;
    if (
      (portLogic as any).from !== undefined &&
      (portLogic as any).to !== undefined &&
      (portLogic as any).from !== '' &&
      (portLogic as any).to !== ''
    ) {
      outputPort = `${outputPort}(${(portLogic as any).from} downto ${(portLogic as any).to})`;
    }
    return (
      `unsigned(${outputPort})` +
      logicTypeToVhdlOperator(portLogic.type) +
      portValue
    );
  }

  return (
    portLogic.port.id_name + logicTypeToVhdlOperator(portLogic.type) + portValue
  );
}

export function getVhdlStateName(state: Node<FSMState>) {
  return VHDL_STATE_PREFIX + state.data.stateNumber;
}

export function getStatesFromNodes(nodes: Node<FSMState>[]) {
  return nodes
    .filter(node => node.id !== RESET_NODE_ID)
    .sort((a, b) => a.data.stateNumber - b.data.stateNumber);
}

export function getDisplayFsmTransitionConditionFromLogic(
  portLogic: PortLogic,
) {
  let portName = portLogic.port.id_name;
  if (
    (portLogic as any).from !== undefined &&
    (portLogic as any).to !== undefined &&
    (portLogic as any).from !== '' &&
    (portLogic as any).to !== ''
  ) {
    portName = `${portName}[${(portLogic as any).from}:${(portLogic as any).to}]`;
  }

  let value = '';
  if (portLogic.expression && portLogic.expression.length > 0) {
    value = portLogic.expression.map(item => item.port).join(''); // For simple cases; can be improved for complex expressions
  } else if (portLogic.customValue) {
    value = String(portLogic.customValue);
  } else {
    value = String(portLogic.port.defaultValue ?? '');
  }

  const op = logicTypeToVhdlOperator(portLogic.type);

  return `${portName}${op}${value}`;
}
