import {useMemo} from 'react';
import {CopyBlock, dracula} from 'react-code-blocks';
import {Edge, Node} from 'reactflow';

import Port from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';
import RoundedScrollContainer from '@shared/RoundedScrollContainer';
import useStoreEdges from '@store/useStoreEdges';
import useStoreNodes from '@store/useStoreNodes';
import useStorePorts from '@store/useStorePorts';
import generateVhdlCode from '@utils/vhdl';

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
  const {inputList, internalsList, outputList} = useStorePorts();
  const {nodes} = useStoreNodes();
  const {edges} = useStoreEdges();
  const resultCode = useMemo(
    () =>
      generateResultingCode(inputList, internalsList, outputList, nodes, edges),
    [edges, inputList, internalsList, nodes, outputList],
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
