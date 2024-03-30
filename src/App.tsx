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
import {zinc} from 'tailwindcss/colors';
import 'reactflow/dist/style.css';
import {Square} from './components/nodes/Square';
import {DefaultEdge} from './components/edges/DefaultEdge';
import * as Toolbar from '@radix-ui/react-toolbar';

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

function App() {
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
    <div className="w-screen h-screen">
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
        <Controls />
      </ReactFlow>
      <Toolbar.Root className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg border-zinc[300] px-8 h-20 w-96 overflow-hidden">
        <Toolbar.Button
          className="w-32 h-32 bg-violet-500 rounded mt-6 hover:-translate-y-2 transition-transform"
          onClick={addNewNode}
        />
      </Toolbar.Root>
    </div>
  );
}

export default App;
