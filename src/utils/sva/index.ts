import {Edge, Node} from 'reactflow';

import FSMState from '@models/state';
import FSMTransition from '@models/transition';
import {getStringWithBreakLines} from '@utils/transduction';

import {generateSvaImports} from './import';
import {generateSvaProperties} from './properties';

export default function generateSVACode(
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  projectName: string,
  authorName: string,
) {
  const baseTabAmount = 0;
  const imports = generateSvaImports(baseTabAmount, projectName, authorName);
  const svaProperties = generateSvaProperties(nodes, edges);
  return getStringWithBreakLines([imports, svaProperties]);
}
