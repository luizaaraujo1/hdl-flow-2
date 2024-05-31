import {useCallback, useState} from 'react';
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  ReactFlowInstance,
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
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    unknown,
    unknown
  > | null>(null);

  const onConnect = useCallback((connection: Connection) => {
    if (connection.targetHandle === NODE_TYPE.State)
      setEdges(edges => addEdge(connection, edges));
  }, []);

  function addNewNode(type: NODE_TYPE, position: {x: number; y: number}) {
    setNotes(nodes => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: type,
        position,
        data: {},
      },
    ]);
  }

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const checkType = (type?: string) => {
    if (type) return type && Object.values(NODE_TYPE).find(nt => nt === type);
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const eventType = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      const type = checkType(eventType);
      if (!type) return;

      if (reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        addNewNode(type, position);
      }
    },
    [reactFlowInstance],
  );

  return (
    <div className="flex-1 bg-slate-100">
      <div className="h-[100vh]">
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
          snapToGrid={true}
          onInit={e => setReactFlowInstance(e)}
          onDrop={onDrop}
          onDragOver={onDragOver}>
          <Background gap={12} size={2} color={zinc[200]} />
          <Controls position="bottom-right" />
        </ReactFlow>
        <SideMenu />
        <SettingsDialog />
      </div>
    </div>
  );
}

export default Canvas;
