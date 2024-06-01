import Port, {PortValue} from './port';

export enum PortLogicType {
  Equality = 'equality',
  LogicNot = 'logic_not',
  LogicOr = 'logic_or',
  LogicAnd = 'logic_and',
  LogicCustom = 'logic_custom',
  Integer_Sum = 'integer_sum',
  Integer_Subtract = 'integer_subtract',
  Custom = 'custom',
  Default = 'default',
}

export interface PortLogic {
  port: Port;
  type: PortLogicType;
  customValue?: PortValue;
}

interface FSMState {
  stateNumber: number;
  name: string;
  portLogic: {
    outputs: {[key: string]: PortLogic};
    internals: {[key: string]: PortLogic};
  };
  isStart?: boolean;
}

export default FSMState;
