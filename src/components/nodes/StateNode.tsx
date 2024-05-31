import {useMemo} from 'react';
import {NodeProps, useStore, ReactFlowState} from 'reactflow';

import {NODE_TYPE, START_NODE_ID} from '../../constants/nodes.constants';
import {useGlobal} from '../../contexts/GlobalContext';
import HiddenHandle from '../shared/HiddenHandle';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function StateNode({id}: NodeProps) {
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

  return (
    <div>
      <div className="absolute -top-2 left-1/2 h-[20px] w-[40px] -translate-x-1/2 bg-blue-500 z-10 border-2 border-black/80 rounded-md" />
      {isTarget && (
        <div className="absolute -bottom-2 left-2/3 h-[20px] min-w-[20px] -translate-x-2/3 bg-red-500 z-10 border-2 border-black/80 rounded-full" />
      )}
      {isSource && (
        <div className="absolute -bottom-2 left-1/3 h-[20px] w-[20px] -translate-x-1/3 bg-green-500 z-10 border-2 border-black/80 rounded-full" />
      )}
      <div
        className={`w-[180px] h-[80px] border-2 border-black/80 relative overflow-hidden rounded-md flex justify-center items-center transition-colors ${targetStyle}`}>
        <HiddenHandle isConnecting={isConnecting} type={NODE_TYPE.State} />
        <h1 className="text-center font-semibold text-black">
          {!isStartTryingToConnectAgain ? label : 'NOT ALLOWED'}
        </h1>
      </div>
    </div>
  );
}

export default StateNode;
