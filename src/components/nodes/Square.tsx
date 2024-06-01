import '@reactflow/node-resizer/dist/style.css';
import {NodeProps, Handle, Position, NodeResizer} from 'reactflow';

function Square({selected}: NodeProps) {
  return (
    <div className="h-full min-h-[200px] w-full min-w-[200px] rounded bg-violet-500">
      <NodeResizer
        minWidth={200}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 rounded border-blue-400"
      />

      <Handle
        className="-top-5 h-3 w-3 border-2 border-blue-400 bg-blue-400/80"
        id="top"
        type="source"
        position={Position.Top}
      />
      <Handle
        className="-bottom-5 h-3 w-3 border-2 border-blue-400 bg-blue-400/80"
        id="bottom"
        type="source"
        position={Position.Bottom}
      />
      <Handle
        className="-left-5 h-3 w-3 border-2 border-blue-400 bg-blue-400/80"
        id="left"
        type="source"
        position={Position.Left}
      />
      <Handle
        className="-right-5 h-3 w-3 border-2 border-blue-400 bg-blue-400/80"
        id="right"
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default Square;
