import {useCallback, useMemo, useRef, useState} from 'react';
import ReactFlow, {
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  ReactFlowInstance,
  addEdge,
  updateEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {zinc} from 'tailwindcss/colors';

import SideMenu from '../components/canvas/SideMenu';
import PortSettingsDialog from '../components/canvas/settings/port/PortSettingsDialog';
import StateSettingsDialog from '../components/canvas/settings/state/StateSettingsDialog';
import TransitionSettingsDialog from '../components/canvas/settings/transition/TransitionSettingsDialog';
import StraightConnectionLine from '../components/edges/StraightConnectionLine';
import {
  EDGE_TYPES,
  connectionLineStyle,
  defaultEdgeOptions,
} from '../constants/edges.constants';
import {
  DRAG_AND_DROP_EVENT_NAME,
  NODE_TYPE,
  NODE_TYPES,
  START_NODE_ID,
} from '../constants/nodes.constants';
import {useGlobal} from '../contexts/GlobalContext';
import FSMTransition, {LogicalOperator} from '../models/transition';
import {getPortLogicObjectFromPorts} from '../utils/port.utils';

function Canvas() {
  const {
    edgeState: {edges, onEdgesChange, setEdges},
    nodeState: {nodes, onNodesChange, setNodes},
    internalsList,
    outputList,
  } = useGlobal();
  const [nodeCount, setNodeCount] = useState(0);
  const [transitionCount, setTransitionCount] = useState(0);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    unknown,
    unknown
  > | null>(null);
  const edgeUpdateSuccessful = useRef(true);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (connection.source === connection.target) return false;
      if (connection.source === START_NODE_ID) {
        const isStartAlreadyConnected = edges.find(
          edge => edge.source === START_NODE_ID,
        );
        if (isStartAlreadyConnected) return false;
      }
      if (connection.targetHandle !== NODE_TYPE.State) return false;
      return true;
    },
    [edges],
  );

  const outputsLogic = useMemo(
    () => getPortLogicObjectFromPorts(outputList),
    [outputList],
  );

  const internalsLogic = useMemo(
    () => getPortLogicObjectFromPorts(internalsList),
    [internalsList],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        //FIXME: Typescript shenanigans
        const newEdge: Edge<FSMTransition> = {
          ...connection,
          source: connection.source,
          target: connection.target,
          id: crypto.randomUUID().toString(),
          data: {
            transitionNumber: transitionCount,
            name: `Transition ${transitionCount}`,
            operator: LogicalOperator.And,
            portLogic: {
              inputs: {},
              internals: {},
            },
          },
        };
        setEdges(edges => addEdge(newEdge, edges));
        setTransitionCount(prev => prev + 1);
      }
    },
    [setEdges, transitionCount],
  );

  const addNewNode = useCallback(
    (type: NODE_TYPE, position: {x: number; y: number}) => {
      const newCount = nodeCount + 1;
      setNodes(nodes => [
        ...nodes,
        {
          id: crypto.randomUUID(),
          type: type,
          position,
          data: {
            stateNumber: newCount,
            name: `State ${newCount}`,
            portLogic: {
              outputs: outputsLogic,
              internals: internalsLogic,
            },
          },
        },
      ]);
      setNodeCount(newCount);
    },
    [internalsLogic, outputsLogic, setNodes, nodeCount],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const checkNodeType = (nodeType?: string) => {
    if (nodeType)
      return (
        nodeType && Object.values(NODE_TYPE).find(type => type === nodeType)
      );
  };

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const eventType = event.dataTransfer.getData(DRAG_AND_DROP_EVENT_NAME);

      const type = checkNodeType(eventType);
      if (!type) return;

      if (reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        addNewNode(type, position);
      }
    },
    [reactFlowInstance, addNewNode],
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge<FSMTransition>, newConnection: Connection) => {
      edgeUpdateSuccessful.current = true;
      setEdges(els => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges],
  );

  const onEdgeUpdateEnd = useCallback(
    (_: unknown, edge: Edge<FSMTransition>) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges(eds => eds.filter(e => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    [setEdges],
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
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onEdgeUpdate={onEdgeUpdate}
          onConnect={onConnect}
          connectionMode={ConnectionMode.Strict}
          isValidConnection={isValidConnection}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineComponent={StraightConnectionLine}
          connectionLineStyle={connectionLineStyle}
          snapGrid={[12, 12]}
          snapToGrid={true}
          onInit={e => setReactFlowInstance(e)}
          onDrop={onDrop}
          onDragOver={onDragOver}
          deleteKeyCode={['Delete', 'Shift']}
          fitView>
          <Background gap={12} size={2} color={zinc[200]} />
          <Controls position="bottom-right" />
        </ReactFlow>
        <SideMenu />
        <PortSettingsDialog />
        <StateSettingsDialog />
        <TransitionSettingsDialog />
      </div>
    </div>
  );
}

export default Canvas;
