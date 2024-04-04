import {useCallback} from 'react';
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {zinc} from 'tailwindcss/colors';

import {DefaultEdge} from '../components/edges/DefaultEdge';
import {Square} from '../components/nodes/Square';
import SideMenu from './SideMenu';

const NODE_TYPES = {
  square: Square,
};

const EDGE_TYPES = {
  default: DefaultEdge,
};

const INITIAL_NODES: Node[] = [
  {
    id: crypto.randomUUID(),
    type: 'square',
    position: {x: 0, y: 0},
    data: {},
  },
  {
    id: crypto.randomUUID(),
    type: 'square',
    position: {x: 400, y: 0},
    data: {},
  },
];

function Canvas() {
  const [nodes, setNotes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges(edges => addEdge(connection, edges));
  }, []);

  function addNewNode() {
    setNotes(nodes => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: 'square',
        position: {x: 400, y: 400},
        data: {},
      },
    ]);
  }

  return (
    <div className="flex-1 bg-slate-100">
      <div className="h-[80vh]">
        <ReactFlow
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionMode={ConnectionMode.Loose}
          defaultEdgeOptions={{type: 'default'}}
          snapGrid={[12, 12]}
          snapToGrid={true}>
          <Background gap={12} size={2} color={zinc[200]} />
          <Controls position="bottom-right" />
        </ReactFlow>
        <SideMenu addNewNode={addNewNode} />
      </div>
    </div>
  );
}

export default Canvas;
