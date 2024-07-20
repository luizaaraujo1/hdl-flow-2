import {CopyBlock, dracula} from 'react-code-blocks';
import {Edge, Node} from 'reactflow';

import {useGlobal} from '@contexts/GlobalContext';
import Port from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';
import RoundedScrollContainer from '@shared/RoundedScrollContainer';
import {generateVhdlCode} from '@utils/vhdl';

function generateResultingCode(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
) {
  return generateVhdlCode(inputList, internalsList, outputList, nodes, edges);
}

function CodeWorkspace() {
  const {
    inputList,
    internalsList,
    outputList,
    nodeState: {nodes},
    edgeState: {edges},
  } = useGlobal();
  const resultCode = generateResultingCode(
    inputList,
    internalsList,
    outputList,
    nodes,
    edges,
  );
  return (
    <RoundedScrollContainer>
      <CopyBlock
        language="vhdl"
        text={resultCode}
        showLineNumbers={true}
        theme={dracula}
        codeBlock={true}
      />
    </RoundedScrollContainer>
  );
}

export default CodeWorkspace;
