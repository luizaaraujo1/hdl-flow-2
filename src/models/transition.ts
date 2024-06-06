import {LogicType, PortLogic, STATE_SUPPORTED_LOGIC_TYPES} from './state';

export interface TransitionPortLogic {
  inputs: {[key: string]: PortLogic};
  internals: {[key: string]: PortLogic};
}

export enum LogicalOperator {
  Or = 'or',
  And = 'and',
}

export const TRANSITION_SUPPORTED_LOGIC_TYPES = [
  ...STATE_SUPPORTED_LOGIC_TYPES,
  {id: LogicType.Inequality, value: LogicType.Inequality},
];

interface FSMTransition {
  transitionNumber: number;
  name: string;
  operator: LogicalOperator;
  portLogic: TransitionPortLogic;
}

export default FSMTransition;
