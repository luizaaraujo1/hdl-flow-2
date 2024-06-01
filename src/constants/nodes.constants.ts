import {Node} from 'reactflow';

import Square from '../components/nodes/Square';
import StartNode from '../components/nodes/StartNode';
import StateNode from '../components/nodes/stateNode/StateNode';

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
  square: Square, //TODO: This will be removed
};

export const START_NODE_ID = 'start_id';

export const DRAG_AND_DROP_EVENT_NAME = 'application/reactflow';

export const INITIAL_NODES: Node[] = [
  {
    id: START_NODE_ID,
    type: NODE_TYPE.Start,
    position: {
      x: getWindowDimensions().width / 2 - 200,
      y: (getWindowDimensions().height * 0.8) / 2,
    },
    data: {},
  },
  {
    id: crypto.randomUUID(),
    type: NODE_TYPE.State,
    position: {
      x: getWindowDimensions().width / 2 + 300,
      y: (getWindowDimensions().height * 0.8) / 2,
    },
    data: {},
  },
];
