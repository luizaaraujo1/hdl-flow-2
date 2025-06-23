import {Edge, Node} from 'reactflow';

import Port from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';
import {getStringWithBreakLines} from '@utils/transduction';

import {generateVerilogImports} from './import';
import {generateVerilogFsmModule} from './module';

export default function generateVerilogCode(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  projectName: string,
  authorName: string,
) {
  const moduleName = 'fsm';
  const baseTabAmount = 0;

  // Generates the imports section (comments)
  const imports = generateVerilogImports(
    baseTabAmount,
    projectName,
    authorName,
  );

  // Declares the FSM module with all logic
  const moduleBody = generateVerilogFsmModule(
    baseTabAmount,
    moduleName,
    inputList,
    outputList,
    internalsList,
    nodes,
    edges,
  );

  return getStringWithBreakLines([imports, moduleBody]);
}
