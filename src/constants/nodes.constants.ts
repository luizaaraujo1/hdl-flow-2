import {Node} from 'reactflow';

import Square from '../components/nodes/Square';
import StartNode from '../components/nodes/StartNode';
import CustomNode from '../components/nodes/StateNode';

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
  [NODE_TYPE.State]: CustomNode,
  square: Square, //TODO: This will be removed
};

export const INITIAL_NODES: Node[] = [
  {
    id: crypto.randomUUID(),
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
