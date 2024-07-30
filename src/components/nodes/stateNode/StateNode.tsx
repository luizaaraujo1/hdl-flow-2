import {useMemo} from 'react';
import {
  NodeProps,
  useStore,
  ReactFlowState,
  NodeToolbar,
  Position,
} from 'reactflow';

import {RESET_NODE_ID} from '@constants/nodes.constants';
import FSMState from '@models/state';
import {CrossCircledIcon, GearIcon} from '@radix-ui/react-icons';
import CanvasButton from '@shared/DeleteButton';
import useStoreDialog from '@store/useStoreDialog';
import useStoreEdges from '@store/useStoreEdges';
import useStoreNodes from '@store/useStoreNodes';

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
  const {edges, setEdges} = useStoreEdges();
  const {setNodes} = useStoreNodes();
  const {setSelectedStateId, setStateSettingsOpen} = useStoreDialog();

  const outputsList = Object.values(outputs);
  const internalsList = Object.values(internals);

  const isConnecting = !!connectionNodeId;

  const connectedEdges = useMemo(
    () => edges.filter(edge => edge.target === id),
    [edges, id],
  );

  const isConnected = !!connectedEdges;

  const isResetConnected = useMemo(
    () => !!edges.find(edge => edge.source === RESET_NODE_ID),
    [edges],
  );

  const isResetTryingToConnectAgain =
    !!isResetConnected &&
    !!connectionNodeId &&
    connectionNodeId === RESET_NODE_ID;

  const isConnectedTryingToConnectAgain =
    isConnected &&
    !!connectedEdges.find(edge => edge.source === connectionNodeId);

  const selectedStyle = selected ? 'border-4' : 'border-2';

  const handleDeleteNode = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id));
    setEdges(edges =>
      edges.filter(edge => edge.target !== id && edge.source !== id),
    );
  };

  const handleOpenEditState = () => {
    setSelectedStateId(id);
    setStateSettingsOpen(true);
  };

  return (
    <div>
      <NodeToolbar
        isVisible={selected}
        position={Position.Top}
        className="flex">
        <CanvasButton
          onClick={handleDeleteNode}
          label="Delete"
          className="bg-red-100"
          displayMode="left"
          icon={<CrossCircledIcon />}
        />
        <CanvasButton
          onClick={handleOpenEditState}
          label="Edit"
          displayMode="right"
          icon={<GearIcon />}
        />
      </NodeToolbar>
      <div
        className={`min-w-[180px] rounded-t-md transition-[border-width] ${selectedStyle} border-b-0 border-black bg-slate-100 shadow-md`}>
        <StateNodeHeader stateNumber={stateNumber} name={name} />
        <StateNodePortList
          outputsList={outputsList}
          internalsList={internalsList}
        />
      </div>
      <StateNodeHandler
        isConnecting={isConnecting}
        isNotAllowed={
          isResetTryingToConnectAgain || isConnectedTryingToConnectAgain
        }
        isConnected={isConnected}
        selectedStyle={selectedStyle}
      />
    </div>
  );
}

export default StateNode;
