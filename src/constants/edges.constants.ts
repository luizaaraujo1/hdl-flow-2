import {DefaultEdgeOptions, MarkerType} from 'reactflow';

import DefaultEdge from '@components/edges/DefaultEdge';
import FloatingEdge from '@components/edges/FloatingEdge';

export enum EDGE_TYPE {
  Default = 'default',
  Floating = 'floating',
}

export const EDGE_TYPES = {
  [EDGE_TYPE.Default]: DefaultEdge,
  [EDGE_TYPE.Floating]: FloatingEdge,
};

export const defaultEdgeOptions: DefaultEdgeOptions = {
  style: {strokeWidth: 2, stroke: 'black'},
  type: EDGE_TYPE.Floating,
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
  updatable: 'target',
};

export const connectionLineStyle: React.CSSProperties = {
  strokeWidth: 2,
  stroke: 'black',
};
