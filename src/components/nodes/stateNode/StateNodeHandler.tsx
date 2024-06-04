import {NODE_TYPE} from '../../../constants/nodes.constants';
import HiddenHandle from '../../shared/HiddenHandle';

interface StateNodeHandlerProps {
  isConnecting: boolean;
  isNotAllowed: boolean;
  isPossibleTarget: boolean;
  isConnected: boolean;
  selectedStyle: string;
}

const StateNodeHandler = ({
  isConnecting,
  isNotAllowed,
  isPossibleTarget,
  isConnected,
  selectedStyle,
}: StateNodeHandlerProps) => {
  const targetStyle = isPossibleTarget
    ? isNotAllowed
      ? 'border-dashed bg-red-500/50'
      : 'border-dashed bg-slate-400'
    : 'border-solid bg-slate-200';

  const label = isPossibleTarget ? 'Drop here' : 'Drag to connect';

  return (
    <div
      className={`relative flex flex-col rounded-b-md border-black/80 px-2 py-3 transition-colors ${targetStyle} transition-[border-width] ${selectedStyle}`}>
      <HiddenHandle isConnecting={isConnecting} type={NODE_TYPE.State} />
      <h1 className="text-center font-semibold uppercase text-black">
        {!isNotAllowed ? label : 'Not allowed'}
      </h1>
      {isConnected && (
        <h6 className="text-center font-sans text-sm font-thin text-slate-500">
          Click below to edit
        </h6>
      )}
    </div>
  );
};

export default StateNodeHandler;
