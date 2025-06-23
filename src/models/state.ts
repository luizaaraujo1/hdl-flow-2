import {
  VERILOG_EQUALITY,
  VERILOG_GREATER_THAN,
  VERILOG_GREATER_THAN_OR_EQUAL,
  VERILOG_INEQUALITY,
  VERILOG_LESS_THAN,
  VERILOG_LESS_THAN_OR_EQUAL,
} from '@constants/verilog';
import {
  VHDL_EQUALITY,
  VHDL_INEQUALITY,
  VHDL_LESS_THAN,
  VHDL_LESS_THAN_OR_EQUAL,
  VHDL_GREATER_THAN,
  VHDL_GREATER_THAN_OR_EQUAL,
} from '@constants/vhdl';

import Port, {PortValue} from './port';

export enum LogicType {
  Equality = 'equality',
  Inequality = 'inequality',
  LessThan = 'less than',
  LessThanOrEqual = 'less than or equal',
  GreaterThan = 'greater than',
  GreaterThanOrEqual = 'greater than or equal',
  Custom = 'custom',
  Default = 'default',
}

export function logicTypeToVhdlOperator(type: LogicType): string {
  switch (type) {
    case LogicType.Equality:
      return VHDL_EQUALITY;
    case LogicType.Inequality:
      return VHDL_INEQUALITY;
    case LogicType.LessThan:
      return VHDL_LESS_THAN;
    case LogicType.LessThanOrEqual:
      return VHDL_LESS_THAN_OR_EQUAL;
    case LogicType.GreaterThan:
      return VHDL_GREATER_THAN;
    case LogicType.GreaterThanOrEqual:
      return VHDL_GREATER_THAN_OR_EQUAL;
    default:
      return VHDL_EQUALITY;
  }
}

export function logicTypeToVerilogOperator(type: LogicType): string {
  switch (type) {
    case LogicType.Equality:
      return VERILOG_EQUALITY;
    case LogicType.Inequality:
      return VERILOG_INEQUALITY;
    case LogicType.LessThan:
      return VERILOG_LESS_THAN;
    case LogicType.LessThanOrEqual:
      return VERILOG_LESS_THAN_OR_EQUAL;
    case LogicType.GreaterThan:
      return VERILOG_GREATER_THAN;
    case LogicType.GreaterThanOrEqual:
      return VERILOG_GREATER_THAN_OR_EQUAL;
    default:
      return VERILOG_EQUALITY;
  }
}

export const STATE_SUPPORTED_LOGIC_TYPES = [
  {id: LogicType.Custom, value: LogicType.Custom},
  {id: LogicType.Default, value: LogicType.Default},
  {id: LogicType.Equality, value: LogicType.Equality},
];

export const OPERATOR_OPTIONS = [
  {id: 'AND', value: 'AND'},
  {id: 'OR', value: 'OR'},
  {id: 'NAND', value: 'NAND'},
  {id: 'NOR', value: 'NOR'},
  {id: 'XOR', value: 'XOR'},
  {id: 'XNOR', value: 'XNOR'},
  {id: '+', value: '+'},
  {id: '-', value: '-'},
  {id: '*', value: '*'},
  {id: '/', value: '/'},
  {id: '<<', value: '<<'},
  {id: '>>', value: '>>'},
];

export type ExpressionItem = {
  port: string;
  operator?: string;
  from?: string;
  to?: string;
};

export interface PortLogic {
  port: Port;
  type: LogicType;
  customValue?: PortValue;
  expression?: ExpressionItem[];
  from?: string;
  to?: string;
}

export interface StatePortLogic {
  outputs: {[key: string]: PortLogic};
  internals: {[key: string]: PortLogic};
}

interface FSMState {
  stateNumber: number;
  name: string;
  portLogic: StatePortLogic;
  isReset?: boolean;
}

export default FSMState;
