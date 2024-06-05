import {CrossCircledIcon, GearIcon} from '@radix-ui/react-icons';
import {useCallback} from 'react';
import {
  useStore,
  getStraightPath,
  EdgeProps,
  EdgeLabelRenderer,
} from 'reactflow';

import {useGlobal} from '../../contexts/GlobalContext';
import FSMTransition from '../../models/transition';
import {getEdgeParams} from '../../utils/edge.utils';
import CanvasButton from '../shared/DeleteButton';

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  selected,
  data,
}: EdgeProps<FSMTransition>) {
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

  const handleDeleteEdge = () =>
    setEdges(edges => edges.filter(e => e.id !== id));

  const handleOpenEditTransition = () => {
    console.log('Open');
  };

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
          <div
            className="-top-[60px] flex"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}>
            <CanvasButton
              onClick={handleDeleteEdge}
              label="Delete"
              className="bg-red-100"
              displayMode="left"
              icon={<CrossCircledIcon />}
            />
            <CanvasButton
              onClick={handleOpenEditTransition}
              label="Edit"
              displayMode="right"
              icon={<GearIcon />}
            />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="nodrag nopan rounded-md border-2 border-black bg-white p-2 text-lg font-semibold shadow-md">
          {`T${data?.transitionNumber}`}
        </div>
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
