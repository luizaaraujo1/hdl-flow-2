import Port, {PortValue} from './port';

export enum LogicType {
  Equality = 'equality',
  Inequality = 'inequality',
  LogicalNot = 'logical_not',
  LogicalOr = 'logical_or',
  LogicalAnd = 'logical_and',
  LogicalCustom = 'logical_custom',
  IntegerSum = 'integer_sum',
  IntegerSubtract = 'integer_subtract',
  Custom = 'custom',
  Default = 'default',
}

export const STATE_SUPPORTED_LOGIC_TYPES = [
  {id: LogicType.Custom, value: LogicType.Custom},
  {id: LogicType.Default, value: LogicType.Default},
  {id: LogicType.Equality, value: LogicType.Equality},
];

export interface PortLogic {
  port: Port;
  type: LogicType;
  customValue?: PortValue;
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
