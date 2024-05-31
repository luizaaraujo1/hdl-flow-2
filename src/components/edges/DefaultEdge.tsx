import {EdgeProps, getSmoothStepPath} from 'reactflow';

function DefaultEdge({
  id,
  style,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <path
      id={id}
      style={style}
      d={edgePath}
      className="react-flow__edge-path"
      markerEnd={markerEnd}
    />
  );
}

export default DefaultEdge;
