import {useMemo} from 'react';
import {NodeProps, useStore, ReactFlowState} from 'reactflow';

import {NODE_TYPE, START_NODE_ID} from '../../constants/nodes.constants';
import {useGlobal} from '../../contexts/GlobalContext';
import HiddenHandle from '../shared/HiddenHandle';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

interface StateNodeProps {
  stateNumber: number;
  name: string;
}

function StateNodeHeader({stateNumber, name}: StateNodeProps) {
  return (
    <div className="flex justify-between border-b-2 border-black">
      <div className="flex-1 border-r-[1px] border-black p-2 text-center font-bold">
        {stateNumber}
      </div>
      <div className="flex-[5] border-l-[1px] border-black p-2">{name}</div>
    </div>
  );
}

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
      <div className="min-h-[100px] min-w-[180px] rounded-t-md border-2 border-b-0 border-black bg-slate-100 shadow-md">
        <StateNodeHeader stateNumber={0} name={'Name'} />
      </div>
      <div
        className={`relative flex flex-col rounded-b-md border-2 border-black/80 px-2 py-3 transition-colors ${targetStyle}`}>
        <HiddenHandle isConnecting={isConnecting} type={NODE_TYPE.State} />
        <h1 className="text-center font-semibold text-black">
          {!isStartTryingToConnectAgain ? label : 'NOT ALLOWED'}
        </h1>
        {isTarget && (
          <h6 className="text-center font-sans text-sm font-thin text-slate-500">
            Interact below to edit
          </h6>
        )}
      </div>
    </div>
  );
}

export default StateNode;
