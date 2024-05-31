import {useCallback} from 'react';
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {zinc} from 'tailwindcss/colors';

import SideMenu from '../components/canvas/SideMenu';
import SettingsDialog from '../components/canvas/settings/SettingsDialog';
import StraightConnectionLine from '../components/edges/StraightConnectionLine';
import {
  EDGE_TYPES,
  connectionLineStyle,
  defaultEdgeOptions,
} from '../constants/edges.constants';
import {
  INITIAL_NODES,
  NODE_TYPE,
  NODE_TYPES,
} from '../constants/nodes.constants';

function Canvas() {
  const [nodes, setNotes, onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.targetHandle === NODE_TYPE.State)
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
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={StraightConnectionLine}
          connectionLineStyle={connectionLineStyle}
          snapGrid={[12, 12]}
          snapToGrid={true}>
          <Background gap={12} size={2} color={zinc[200]} />
          <Controls position="bottom-right" />
        </ReactFlow>
        <SideMenu addNewNode={addNewNode} />
        <SettingsDialog />
      </div>
    </div>
  );
}

export default Canvas;
