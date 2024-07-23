import {useCallback, useMemo, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
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

import SideMenu from '@components/canvas/menu/SideMenu';
import StraightConnectionLine from '@components/edges/StraightConnectionLine';
import ErrorPage from '@components/shared/ErrorPage';
import {
  EDGE_TYPES,
  connectionLineStyle,
  defaultEdgeOptions,
} from '@constants/edges.constants';
import {
  DRAG_AND_DROP_EVENT_NAME,
  NODE_TYPE,
  NODE_TYPES,
  START_NODE_ID,
} from '@constants/nodes.constants';
import ROUTE_PATHS from '@constants/routePaths';
import {useGlobal} from '@contexts/GlobalContext';
import FSMTransition, {LogicalOperator} from '@models/transition';
import {getPortLogicObjectFromPorts} from '@utils/port.utils';

function Canvas() {
  if (window.screen.width < 768) {
    return (
      <ErrorPage
        title="Sorry! We're not on mobile yet"
        subtitle="(Work in progress)"
        buttonText="Go Home"
      />
    );
  }

  const {
    edgeState: {edges, onEdgesChange, setEdges},
    nodeState: {nodes, onNodesChange, setNodes},
    counterState: {
      nodeCount,
      setNodeCount,
      setTransitionCount,
      transitionCount,
    },
    internalsList,
    outputList,
  } = useGlobal();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    unknown,
    unknown
  > | null>(null);
  const edgeUpdateSuccessful = useRef(true);

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (connection.source === START_NODE_ID) {
        const isStartAlreadyConnected = edges.find(
          edge => edge.source === START_NODE_ID,
        );
        if (isStartAlreadyConnected) return false;
      }
      const isAlreadyConnected =
        edges.filter(
          edge =>
            edge.target === connection.target &&
            edge.source === connection.source,
        ).length > 0;
      if (isAlreadyConnected) return false;
      if (connection.targetHandle !== NODE_TYPE.State) return false;
      return true;
    },
    [edges],
  );

  const outputsLogicObject = useMemo(
    () => getPortLogicObjectFromPorts(outputList),
    [outputList],
  );

  const internalsLogicObject = useMemo(
    () => getPortLogicObjectFromPorts(internalsList),
    [internalsList],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        //FIXME: Typescript shenanigans
        const isStartNode = connection.source === START_NODE_ID;
        const count = isStartNode ? 0 : transitionCount;
        const newEdge: Edge<FSMTransition> = {
          ...connection,
          source: connection.source,
          target: connection.target,
          id: crypto.randomUUID().toString(),
          data: {
            transitionNumber: count,
            name: `Transition ${count}`,
            operator: LogicalOperator.And,
            portLogic: {
              inputs: {},
              internals: {},
            },
          },
        };
        setEdges(edges => addEdge(newEdge, edges));
        if (connection.source !== START_NODE_ID)
          setTransitionCount(prev => prev + 1);
      }
    },
    [setEdges, setTransitionCount, transitionCount],
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
              outputs: outputsLogicObject,
              internals: internalsLogicObject,
            },
          },
        },
      ]);
      setNodeCount(newCount);
    },
    [
      nodeCount,
      setNodes,
      setNodeCount,
      outputsLogicObject,
      internalsLogicObject,
    ],
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
      <Link to={ROUTE_PATHS.Home}>
        <header className="fixed z-10 flex w-fit items-center justify-center rounded-br-lg bg-gray-800 p-4 px-10 text-gray-100 shadow-md hover:cursor-pointer hover:bg-slate-900 hover:shadow-lg">
          <h1 className="text-center text-2xl font-bold text-white">
            HDL Flow
          </h1>
        </header>
      </Link>
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
      </div>
    </div>
  );
}

export default Canvas;
