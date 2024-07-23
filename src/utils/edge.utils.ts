import {Position, Node} from 'reactflow';

//Here's the source for most of this code: https://reactflow.dev/examples/nodes/easy-connect:

function getNodeIntersection(
  intersectionNode: Node<unknown, string | undefined>,
  targetNode: Node<unknown, string | undefined>,
) {
  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;
  const targetPosition = targetNode.positionAbsolute;

  if (
    intersectionNodeWidth &&
    intersectionNodeHeight &&
    intersectionNodePosition &&
    targetPosition &&
    targetNode.width &&
    targetNode.height
  ) {
    const w = intersectionNodeWidth / 2;
    const h = intersectionNodeHeight / 2;

    const x2 = intersectionNodePosition.x + w;
    const y2 = intersectionNodePosition.y + h;
    const x1 = targetPosition.x + targetNode.width / 2;
    const y1 = targetPosition.y + targetNode.height / 2;

    const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
    const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
    const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
    const xx3 = a * xx1;
    const yy3 = a * yy1;
    const x = w * (xx3 + yy3) + x2;
    const y = h * (-xx3 + yy3) + y2;

    return {x, y};
  }
  console.error('ERROR: Failed to get intersection requirements');
  return {x: 0, y: 0};
}

function getEdgePosition(
  node: Node<unknown, string | undefined>,
  intersectionPoint: {
    x: number;
    y: number;
  },
) {
  const n = {...node.positionAbsolute, ...node};
  if (n.x && n.y && n.width && n.height) {
    const nx = Math.round(n.x);
    const ny = Math.round(n.y);
    const px = Math.round(intersectionPoint.x);
    const py = Math.round(intersectionPoint.y);

    if (px <= nx + 1) {
      return Position.Left;
    }
    if (px >= nx + n.width - 1) {
      return Position.Right;
    }
    if (py <= ny + 1) {
      return Position.Top;
    }
    if (py >= n.y + n.height - 1) {
      return Position.Bottom;
    }
  }

  return Position.Top;
}

export function getEdgeParams(
  source: Node<unknown, string | undefined>,
  target: Node<unknown, string | undefined>,
) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

export type GetCurvedPathParams = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export const getCurvedPath = (
  {sourceX, sourceY, targetX, targetY}: GetCurvedPathParams,
  offset: number,
): [
  path: string,
  labelX: number,
  labelY: number,
  offsetX: number,
  offsetY: number,
] => {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;

  const angle = Math.atan2(dy, dx);

  const offsetX = offset * Math.sin(angle);
  const offsetY = offset * -Math.cos(angle);

  const centerX = (sourceX + targetX) / 2 + offsetX;
  const centerY = (sourceY + targetY) / 2 + offsetY;

  const edgePath = `M ${sourceX} ${sourceY} Q ${centerX} ${centerY} ${targetX} ${targetY}`;

  return [edgePath, centerX, centerY, offsetX, offsetY];
};
