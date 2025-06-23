import {Edge, Node} from 'reactflow';

import Port from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';
import {getStringWithBreakLines} from '@utils/transduction';

import {generateVhdlFsmArchitecture} from './architecture';
import {generateVhdlFsmEntity} from './entity';
import {generateVhdlImports} from './imports';

export default function generateVhdlCode(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  projectName: string,
  authorName: string,
) {
  const entityName = 'FSM';
  const architectureName = 'Behavioral';
  const baseTabAmount = 0;

  // Generates the imports section
  const imports = generateVhdlImports(baseTabAmount, projectName, authorName);

  // Declares the FSM entity and it's ports
  const entity = generateVhdlFsmEntity(
    baseTabAmount,
    entityName,
    inputList,
    outputList,
  );

  // Declares the FSM architecture with both clock and por processes
  const architecture = generateVhdlFsmArchitecture(
    baseTabAmount,
    architectureName,
    entityName,
    inputList,
    outputList,
    internalsList,
    nodes,
    edges,
  );

  return getStringWithBreakLines([imports, entity, architecture]);
}
