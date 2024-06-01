import {useMemo} from 'react';
import {NodeProps, useStore, ReactFlowState} from 'reactflow';

import {START_NODE_ID} from '../../../constants/nodes.constants';
import {useGlobal} from '../../../contexts/GlobalContext';
import StateNodeHandler from './StateNodeHandler';
import StateNodeHeader from './StateNodeHeader';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function StateNode({id}: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const {
    edgeState: {edges},
  } = useGlobal();

  const isConnecting = !!connectionNodeId;
  const isPossibleTarget = !!connectionNodeId && connectionNodeId !== id;

  const isConnected = useMemo(
    () => !!edges.find(edge => edge.target === id),
    [edges],
  );

  const isStartConnected = useMemo(
    () => !!edges.find(edge => edge.source === START_NODE_ID),
    [edges],
  );

  const isStartTryingToConnectAgain =
    !!isStartConnected &&
    !!connectionNodeId &&
    connectionNodeId === START_NODE_ID;

  return (
    <div>
      <div className="min-h-[100px] min-w-[180px] rounded-t-md border-2 border-b-0 border-black bg-slate-100 shadow-md">
        <StateNodeHeader stateNumber={0} name={'Name'} />
      </div>
      <StateNodeHandler
        isConnecting={isConnecting}
        isNotAllowed={isStartTryingToConnectAgain}
        isPossibleTarget={isPossibleTarget}
        isConnected={isConnected}
      />
    </div>
  );
}

export default StateNode;
