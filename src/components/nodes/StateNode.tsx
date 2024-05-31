import {NodeProps, useStore, ReactFlowState} from 'reactflow';

import {NODE_TYPE} from '../../constants/nodes.constants';
import HiddenHandle from '../shared/HiddenHandle';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function StateNode({id}: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const label = isTarget ? 'Drop here' : 'Drag to connect';
  const targetStyle = isTarget
    ? 'border-dashed bg-slate-400'
    : 'border-solid bg-slate-200';

  return (
    <div>
      <div className="absolute -top-2 left-1/2 h-[20px] w-[40px] -translate-x-1/2 bg-blue-500 z-10 border-2 border-black/80 rounded-md" />
      <div
        className={`w-[150px] h-[80px] border-2 border-black/80 relative overflow-hidden rounded-md flex justify-center items-center transition-colors ${targetStyle}`}>
        <HiddenHandle isConnecting={isConnecting} type={NODE_TYPE.State} />
        {label}
      </div>
    </div>
  );
}

export default StateNode;
