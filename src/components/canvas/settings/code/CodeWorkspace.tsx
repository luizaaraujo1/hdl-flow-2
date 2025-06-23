import {useMemo, useState} from 'react';
import {CopyBlock, dracula} from 'react-code-blocks';
import {Edge, Node} from 'reactflow';

import Port from '@models/port';
import FSMState from '@models/state';
import FSMTransition from '@models/transition';
import RoundedScrollContainer from '@shared/RoundedScrollContainer';
import useStoreEdges from '@store/useStoreEdges';
import useStoreNodes from '@store/useStoreNodes';
import useStorePorts from '@store/useStorePorts';
import useStoreSettings from '@store/useStoreSettings';
import generateSVACode from '@utils/sva';
import {generateTclSvaProperties} from '@utils/sva/properties_tcl';
import generateVerilogCode from '@utils/verilog';
import generateVhdlCode from '@utils/vhdl';

type CodeLanguage = 'vhdl' | 'verilog' | 'sva-embedded' | 'sva-tcl';

function generateResultingCode(
  inputList: Port[],
  internalsList: Port[],
  outputList: Port[],
  nodes: Node<FSMState>[],
  edges: Edge<FSMTransition>[],
  projectName: string,
  authorName: string,
  language: CodeLanguage,
) {
  if (language === 'verilog') {
    return generateVerilogCode(
      inputList,
      internalsList,
      outputList,
      nodes,
      edges,
      projectName,
      authorName,
    );
  }
  if (language === 'sva-embedded') {
    return generateSVACode(nodes, edges, projectName, authorName);
  }
  if (language === 'sva-tcl') {
    return generateTclSvaProperties(nodes, edges, 'current_state');
  }
  return generateVhdlCode(
    inputList,
    internalsList,
    outputList,
    nodes,
    edges,
    projectName,
    authorName,
  );
}

function CodeWorkspace() {
  const {inputList, internalsList, outputList} = useStorePorts();
  const {nodes} = useStoreNodes();
  const {edges} = useStoreEdges();
  const {projectName, authorName} = useStoreSettings();

  const [language, setLanguage] = useState<CodeLanguage>('vhdl');

  const resultCode = useMemo(
    () =>
      generateResultingCode(
        inputList,
        internalsList,
        outputList,
        nodes,
        edges,
        projectName,
        authorName,
        language,
      ),
    [
      authorName,
      edges,
      inputList,
      internalsList,
      nodes,
      outputList,
      projectName,
      language,
    ],
  );

  return (
    <RoundedScrollContainer>
      <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
        <button
          onClick={() => setLanguage('vhdl')}
          style={{
            padding: '4px 12px',
            background: language === 'vhdl' ? '#444' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}>
          VHDL
        </button>
        <button
          onClick={() => setLanguage('verilog')}
          style={{
            padding: '4px 12px',
            background: language === 'verilog' ? '#444' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}>
          Verilog
        </button>
        <button
          onClick={() => setLanguage('sva-embedded')}
          style={{
            padding: '4px 12px',
            background: language === 'sva-embedded' ? '#444' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}>
          SVA (Embedded)
        </button>
        <button
          onClick={() => setLanguage('sva-tcl')}
          style={{
            padding: '4px 12px',
            background: language === 'sva-tcl' ? '#444' : '#222',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}>
          SVA (Tcl)
        </button>
      </div>
      <CopyBlock
        language={
          language === 'sva-embedded'
            ? 'verilog'
            : language === 'sva-tcl'
              ? 'tcl'
              : language
        }
        text={resultCode}
        showLineNumbers={true}
        theme={dracula}
        codeBlock={true}
      />
    </RoundedScrollContainer>
  );
}

export default CodeWorkspace;
