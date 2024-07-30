import {Node} from 'reactflow';

import ResetNode from '@components/nodes/ResetNode';
import StateNode from '@components/nodes/stateNode/StateNode';
import FSMState from '@models/state';

function getWindowDimensions() {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height,
  };
}

export enum NODE_TYPE {
  Reset = 'reset',
  State = 'state',
}

export const NODE_TYPES = {
  [NODE_TYPE.Reset]: ResetNode,
  [NODE_TYPE.State]: StateNode,
};

export const RESET_NODE_ID = 'reset_id';

export const DRAG_AND_DROP_EVENT_NAME = 'application/reactflow';

export const INITIAL_NODES: Node<FSMState>[] = [
  {
    id: RESET_NODE_ID,
    type: NODE_TYPE.Reset,
    position: {
      x: getWindowDimensions().width / 2 - 200,
      y: (getWindowDimensions().height * 0.8) / 2,
    },
    draggable: false,
    deletable: false,
    selectable: false,
    focusable: false,
    data: {
      stateNumber: -1,
      name: 'Reset',
      isReset: true,
      portLogic: {
        outputs: {},
        internals: {},
      },
    },
  },
  {
    id: crypto.randomUUID(),
    type: NODE_TYPE.State,
    position: {
      x: getWindowDimensions().width / 2 + 300,
      y: (getWindowDimensions().height * 0.8) / 2,
    },
    data: {
      stateNumber: 0,
      name: 'State 0',
      portLogic: {
        outputs: {},
        internals: {},
      },
    },
  },
];

export function getInitialNodes() {
  return INITIAL_NODES;
}
