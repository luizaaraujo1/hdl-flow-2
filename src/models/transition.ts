import {PortLogic} from './state';

export interface TransitionPortLogic {
  inputs: {[key: string]: PortLogic};
  internals: {[key: string]: PortLogic};
}

interface FSMTransition {
  transitionNumber: number;
  name: string;
  portLogic: TransitionPortLogic;
}

export default FSMTransition;
