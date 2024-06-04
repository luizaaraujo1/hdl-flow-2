import {CrossCircledIcon} from '@radix-ui/react-icons';
import {useCallback} from 'react';
import {
  useStore,
  getStraightPath,
  EdgeProps,
  EdgeLabelRenderer,
} from 'reactflow';

import {useGlobal} from '../../contexts/GlobalContext';
import {getEdgeParams} from '../../utils/edge.utils';

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  selected,
}: EdgeProps) {
  const {
    edgeState: {setEdges},
  } = useGlobal();
  const sourceNode = useStore(
    useCallback(store => store.nodeInternals.get(source), [source]),
  );
  const targetNode = useStore(
    useCallback(store => store.nodeInternals.get(target), [target]),
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const {sx, sy, tx, ty} = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path transition-[stroke-width]"
        d={edgePath}
        markerEnd={markerEnd}
        style={
          selected
            ? {...style, strokeWidth: (Number(style?.strokeWidth) ?? 2) + 1}
            : style
        }
      />
      <EdgeLabelRenderer>
        {selected && (
          <div className="flex gap-2 rounded-md">
            <button
              onClick={() => setEdges(edges => edges.filter(e => e.id !== id))}
              className="nodrag nopan btn-canvas -top-[50px] rounded-md p-2"
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                pointerEvents: 'all',
              }}>
              Delete <CrossCircledIcon className="ml-2" />
            </button>
          </div>
        )}
      </EdgeLabelRenderer>
      {/* Used for click area */}
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{stroke: 'transparent', strokeWidth: '20px'}}
      />
    </>
  );
}

export default FloatingEdge;
