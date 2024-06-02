import {NodeProps, ReactFlowState, useStore} from 'reactflow';

import {NODE_TYPE} from '../../constants/nodes.constants';
import HiddenHandle from '../shared/HiddenHandle';

const connectionNodeIdSelector = (state: ReactFlowState) =>
  state.connectionNodeId;

function StartNode({id}: NodeProps) {
  const connectionNodeId = useStore(connectionNodeIdSelector);

  const isConnecting = !!connectionNodeId;
  const isTarget = connectionNodeId && connectionNodeId !== id;
  const targetStyle = isTarget
    ? 'border-dashed bg-red-500/50'
    : 'border-solid bg-red-500';

  return (
    <div
      className={`h-[100px] w-[100px] content-center rounded-full border-2 border-black transition-colors ${targetStyle}`}>
      <h1 className="text-center font-semibold text-black">
        {isTarget ? 'NOT ALLOWED' : 'START'}
      </h1>
      <HiddenHandle isConnecting={isConnecting} type={NODE_TYPE.Start} />
    </div>
  );
}

export default StartNode;
