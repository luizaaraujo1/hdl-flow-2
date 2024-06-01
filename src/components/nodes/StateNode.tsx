import {useMemo} from 'react';
import {NodeProps, useStore, ReactFlowState} from 'reactflow';

import {NODE_TYPE, START_NODE_ID} from '../../constants/nodes.constants';
import {useGlobal} from '../../contexts/GlobalContext';
import HiddenHandle from '../shared/HiddenHandle';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function StateNode({id, selected}: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);
  const {
    edgeState: {edges},
  } = useGlobal();

  const isConnecting = !!connectionNodeId;
  const isPossibleTarget = connectionNodeId && connectionNodeId !== id;

  const isTarget = useMemo(
    () => edges.find(edge => edge.target === id),
    [edges],
  );
  const isSource = useMemo(
    () => edges.find(edge => edge.source === id),
    [edges],
  );
  const isStartConnected = useMemo(
    () => edges.find(edge => edge.source === START_NODE_ID),
    [edges],
  );
  const isStartTryingToConnectAgain =
    isStartConnected && connectionNodeId && connectionNodeId === START_NODE_ID;

  const targetStyle = isPossibleTarget
    ? isStartTryingToConnectAgain
      ? 'border-dashed bg-red-500/50'
      : 'border-dashed bg-slate-400'
    : 'border-solid bg-slate-200';

  const label = isPossibleTarget ? 'DROP HERE' : 'DRAG TO CONNECT';

  const selectedStyle = selected
    ? 'bg-blue-500 border-black'
    : 'bg-blue-500/50 border-black/80';

  return (
    <div>
      <div
        className={`absolute -top-2 left-1/2 z-10 h-[20px] w-[40px] -translate-x-1/2 rounded-md border-2 transition-all ${selectedStyle}`}
      />
      {isTarget && (
        <div className="absolute -bottom-2 left-2/3 z-10 h-[20px] min-w-[20px] -translate-x-2/3 rounded-full border-2 border-black/80 bg-red-500/50" />
      )}
      {isSource && (
        <div className="absolute -bottom-2 left-1/3 z-10 h-[20px] w-[20px] -translate-x-1/3 rounded-full border-2 border-black/80 bg-green-500/50" />
      )}
      <div
        className={`relative flex h-[80px] w-[180px] items-center justify-center overflow-hidden rounded-md border-2 border-black/80 transition-colors ${targetStyle}`}>
        <HiddenHandle isConnecting={isConnecting} type={NODE_TYPE.State} />
        <h1 className="text-center font-semibold text-black">
          {!isStartTryingToConnectAgain ? label : 'NOT ALLOWED'}
        </h1>
      </div>
    </div>
  );
}

export default StateNode;
