import {useCallback, useMemo, useState} from 'react';
import {Node} from 'reactflow';

import {PortCategory} from '../../../../constants/ports.constants';
import {useDialog} from '../../../../contexts/DialogContext';
import {useGlobal} from '../../../../contexts/GlobalContext';
import FSMTransition from '../../../../models/transition';
import {numericOnlyPattern, removeAllNonNumeric} from '../../../../utils/input';
import RoundedScrollContainer from '../../../shared/RoundedScrollContainer';
import TextInput from '../../../shared/TextInput';
import TransitionConditionAdder from './TransitionConditionAdder';

function TransitionEditor() {
  const {selectedTransitionId} = useDialog();
  const {
    edgeState: {edges, setEdges},
    inputList,
    internalsList,
  } = useGlobal();
  const [selectedInputId, setSelectedInputId] = useState<string | undefined>(
    undefined,
  );
  const [selectedInternalId, setSelectedInternalId] = useState<
    string | undefined
  >(undefined);

  const currentEdge = useMemo(
    () => edges.find(edge => edge.id === selectedTransitionId),
    [edges, selectedTransitionId],
  );

  const transitionData = useMemo(() => currentEdge?.data, [currentEdge?.data]);

  const handleEdgeUpdate = useCallback(
    (
      field: keyof Node<FSMTransition>,
      value: Node<FSMTransition>[keyof Node<FSMTransition>],
    ) => {
      if (selectedTransitionId && currentEdge) {
        const newNode = {...currentEdge, [field]: value};
        const newNodes = [...edges].filter(
          edge => edge.id !== selectedTransitionId,
        );
        newNodes.push(newNode);
        setEdges(newNodes);
      }
    },
    [currentEdge, edges, selectedTransitionId, setEdges],
  );

  const handleTransitionUpdate = useCallback(
    (field: keyof FSMTransition, value: FSMTransition[keyof FSMTransition]) => {
      if (selectedTransitionId && currentEdge && currentEdge.data) {
        let newValue = value;
        if (field === 'transitionNumber')
          newValue = Number(removeAllNonNumeric(String(newValue)));
        const newData = {...currentEdge.data, [field]: newValue};
        handleEdgeUpdate('data', newData);
      }
    },
    [currentEdge, handleEdgeUpdate, selectedTransitionId],
  );

  const handleAddCondition = (portCategory: PortCategory) => {
    if (portCategory === 'Input') {
      console.log('Add Input');
      return;
    }
    console.log('Add Internal');
  };

  const handleSelectInput = (id: string) => setSelectedInputId(id);

  const handleSelectInternal = (id: string) => setSelectedInternalId(id);

  const INPUT_OPTIONS = useMemo(
    () =>
      [...inputList].map(port => ({
        id: port.id,
        value: port.id_name,
      })),
    [inputList],
  );

  const INTERNAL_OPTIONS = useMemo(
    () =>
      [...internalsList].map(port => ({
        id: port.id,
        value: port.id_name,
      })),
    [internalsList],
  );

  return (
    <RoundedScrollContainer>
      <fieldset className="mb-4 mr-16 grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <TextInput
            id="transition_name"
            label="Transition Name"
            placeholder="Give this Transition a name"
            onTextChange={value => handleTransitionUpdate('name', value)}
            value={transitionData?.name ?? ''}
            required
          />
        </div>
        <div className="flex flex-col">
          <TextInput
            id="transition_number"
            label="Transition Number"
            placeholder="Set a unique number for this Transition"
            onTextChange={value =>
              handleTransitionUpdate('transitionNumber', value)
            }
            pattern={numericOnlyPattern}
            value={String(transitionData?.transitionNumber) ?? ''}
            required
          />
        </div>
      </fieldset>
      <TransitionConditionAdder
        selectLabel="Input Port"
        selectedId={selectedInputId ?? ''}
        addLabel="Add New Input Condition"
        onSelect={id => handleSelectInput(id)}
        onAdd={() => handleAddCondition('Input')}
        options={INPUT_OPTIONS}
      />
      <TransitionConditionAdder
        selectLabel="Internal Port"
        selectedId={selectedInternalId ?? ''}
        addLabel="Add New Internal Condition"
        onSelect={id => handleSelectInternal(id)}
        onAdd={() => handleAddCondition('Internal')}
        options={INTERNAL_OPTIONS}
        alignRight
      />
    </RoundedScrollContainer>
  );
}

export default TransitionEditor;
