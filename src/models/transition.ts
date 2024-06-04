import {PortLogic, StatePortLogic} from './state';

export interface TransitionPortLogic extends StatePortLogic {
  inputs: {[key: string]: PortLogic};
}

interface FSMTransition {
  transitionNumber: number;
  name: string;
  portLogic: TransitionPortLogic;
}

export default FSMTransition;
