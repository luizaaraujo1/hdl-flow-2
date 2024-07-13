import {Node} from 'reactflow';

import StartNode from '@components/nodes/StartNode';
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
  Start = 'start',
  State = 'state',
}

export const NODE_TYPES = {
  [NODE_TYPE.Start]: StartNode,
  [NODE_TYPE.State]: StateNode,
};

export const START_NODE_ID = 'start_id';

export const DRAG_AND_DROP_EVENT_NAME = 'application/reactflow';

export const INITIAL_NODES: Node<FSMState>[] = [
  {
    id: START_NODE_ID,
    type: NODE_TYPE.Start,
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
      name: 'Start',
      isStart: true,
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
