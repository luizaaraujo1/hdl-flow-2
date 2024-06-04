import {useMemo} from 'react';
import {
  NodeProps,
  useStore,
  ReactFlowState,
  NodeToolbar,
  Position,
} from 'reactflow';

import {START_NODE_ID} from '../../../constants/nodes.constants';
import {useGlobal} from '../../../contexts/GlobalContext';
import FSMState from '../../../models/state';
import DeleteButton from '../../shared/DeleteButton';
import StateNodeHandler from './StateNodeHandler';
import StateNodeHeader from './StateNodeHeader';
import StateNodePortList from './StateNodePortList';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function StateNode({id, selected, data}: NodeProps<FSMState>) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const {
    stateNumber,
    name,
    portLogic: {internals, outputs},
  } = data;
  const {
    edgeState: {edges, setEdges},
    nodeState: {setNodes},
  } = useGlobal();

  const outputsList = Object.values(outputs);
  const internalsList = Object.values(internals);

  const isConnecting = !!connectionNodeId;
  const isPossibleTarget = !!connectionNodeId && connectionNodeId !== id;

  const isConnected = useMemo(
    () => !!edges.find(edge => edge.target === id),
    [edges, id],
  );

  const isStartConnected = useMemo(
    () => !!edges.find(edge => edge.source === START_NODE_ID),
    [edges],
  );

  const isStartTryingToConnectAgain =
    !!isStartConnected &&
    !!connectionNodeId &&
    connectionNodeId === START_NODE_ID;

  const selectedStyle = selected ? 'border-4' : 'border-2';

  const handleDeleteNode = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
    setEdges(edges =>
      edges.filter(edge => edge.target !== id && edge.source !== id),
    );
  };

  return (
    <div>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <DeleteButton onDelete={handleDeleteNode} />
      </NodeToolbar>
      <div
        className={`selection: min-w-[180px] rounded-t-md transition-[border-width] ${selectedStyle} border-b-0 border-black bg-slate-100 shadow-md`}>
        <StateNodeHeader stateNumber={stateNumber} name={name} />
        <StateNodePortList
          outputsList={outputsList}
          internalsList={internalsList}
        />
      </div>
      <StateNodeHandler
        isConnecting={isConnecting}
        isNotAllowed={isStartTryingToConnectAgain}
        isPossibleTarget={isPossibleTarget}
        isConnected={isConnected}
        selectedStyle={selectedStyle}
      />
    </div>
  );
}

export default StateNode;
