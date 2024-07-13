import {useCallback, useEffect, useMemo, useState} from 'react';
import {Node} from 'reactflow';

import LogicEditor from '@components/canvas/settings/logic/LogicEditor';
import {PortCategory} from '@constants/ports.constants';
import {useDialog} from '@contexts/DialogContext';
import {useGlobal} from '@contexts/GlobalContext';
import Port from '@models/port';
import {PortLogic} from '@models/state';
import FSMTransition, {
  LogicalOperator,
  TransitionPortLogic,
} from '@models/transition';
import RoundedScrollContainer from '@shared/RoundedScrollContainer';
import SelectInput from '@shared/SelectInput';
import TextInput from '@shared/TextInput';
import {numericOnlyPattern, removeAllNonNumeric} from '@utils/input';
import {getPortLogicObjectFromPorts} from '@utils/port.utils';

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

  const inputsLogicList = useMemo(() => {
    if (transitionData?.portLogic.inputs) {
      return Object.values(transitionData?.portLogic.inputs);
    }
    return [];
  }, [transitionData?.portLogic.inputs]);

  const internalsLogicList = useMemo(() => {
    if (transitionData?.portLogic.internals) {
      return Object.values(transitionData?.portLogic.internals);
    }
    return [];
  }, [transitionData?.portLogic.internals]);

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

  const addLogic = useCallback(
    (portId: string, portCategory: PortCategory) => {
      const isInternal = portCategory === 'Internal';
      const portLogicCategory: keyof TransitionPortLogic = isInternal
        ? 'internals'
        : 'inputs';
      let newPort: Port | undefined;

      if (isInternal) newPort = internalsList.find(port => port.id === portId);
      else newPort = inputList.find(port => port.id === portId);

      if (newPort) {
        const newPortLogicValue = getPortLogicObjectFromPorts([newPort]);
        if (transitionData) {
          const currentPortLogicObject =
            transitionData.portLogic[portLogicCategory];
          const newPortLogic = {
            ...currentPortLogicObject,
            ...newPortLogicValue,
          };
          const newTransitionPortLogic: TransitionPortLogic = {
            ...transitionData.portLogic,
            [portLogicCategory]: newPortLogic,
          };
          handleTransitionUpdate('portLogic', newTransitionPortLogic);
          if (isInternal) setSelectedInternalId(undefined);
          else setSelectedInputId(undefined);
        }
      }
    },
    [handleTransitionUpdate, inputList, internalsList, transitionData],
  );

  const editLogic = useCallback(
    (
      portId: string,
      portCategory: PortCategory,
      field: keyof PortLogic,
      value: PortLogic[keyof PortLogic],
    ) => {
      const isInternal = portCategory === 'Internal';
      const portLogicCategory: keyof TransitionPortLogic = isInternal
        ? 'internals'
        : 'inputs';

      if (transitionData?.portLogic) {
        const currentPortLogicObject =
          transitionData.portLogic[portLogicCategory];
        const oldPortLogic = currentPortLogicObject[portId];
        const newPortLogic = {
          ...currentPortLogicObject,
          [portId]: {...oldPortLogic, [field]: value},
        };
        const newTransitionPortLogic: TransitionPortLogic = {
          ...transitionData.portLogic,
          [portLogicCategory]: newPortLogic,
        };
        handleTransitionUpdate('portLogic', newTransitionPortLogic);
      }
    },
    [handleTransitionUpdate, transitionData?.portLogic],
  );

  const deleteLogic = useCallback(
    (portId: string, portCategory: PortCategory) => {
      const isInternal = portCategory === 'Internal';
      const portLogicCategory: keyof TransitionPortLogic = isInternal
        ? 'internals'
        : 'inputs';

      if (transitionData?.portLogic) {
        const currentPortLogicObject =
          transitionData.portLogic[portLogicCategory];
        const newPortLogic = {...currentPortLogicObject};
        delete newPortLogic[portId];
        const newTransitionPortLogic: TransitionPortLogic = {
          ...transitionData.portLogic,
          [portLogicCategory]: newPortLogic,
        };
        handleTransitionUpdate('portLogic', newTransitionPortLogic);
      }
    },
    [handleTransitionUpdate, transitionData?.portLogic],
  );

  const handleAddCondition = useCallback(
    (portCategory: PortCategory) => {
      if (selectedInputId && portCategory === 'Input') {
        addLogic(selectedInputId, 'Input');
      }
      if (selectedInternalId && portCategory === 'Internal') {
        addLogic(selectedInternalId, 'Internal');
      }
    },
    [addLogic, selectedInputId, selectedInternalId],
  );

  const handleSelectInput = (id: string) => setSelectedInputId(id);

  const handleSelectInternal = (id: string) => setSelectedInternalId(id);

  const OPERATOR_OPTIONS = [
    {id: LogicalOperator.And, value: 'All conditions must be valid'},
    {id: LogicalOperator.Or, value: 'At least one condition must be valid'},
  ];

  const INPUT_OPTIONS = useMemo(
    () =>
      [...inputList]
        .map(port => ({
          id: port.id,
          value: port.id_name,
        }))
        .filter(
          element =>
            !inputsLogicList.find(logic => logic.port.id === element.id),
        ),
    [inputList, inputsLogicList],
  );

  const INTERNAL_OPTIONS = useMemo(
    () =>
      [...internalsList]
        .map(port => ({
          id: port.id,
          value: port.id_name,
        }))
        .filter(
          element =>
            !internalsLogicList.find(logic => logic.port.id === element.id),
        ),
    [internalsList, internalsLogicList],
  );

  useEffect(() => {
    if (INPUT_OPTIONS.length > 0 && !selectedInputId)
      setSelectedInputId(INPUT_OPTIONS[0].id);
    if (INTERNAL_OPTIONS.length > 0 && !selectedInternalId)
      setSelectedInternalId(INTERNAL_OPTIONS[0].id);
  }, [INPUT_OPTIONS, INTERNAL_OPTIONS, selectedInputId, selectedInternalId]);

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
        <div className="flex flex-col">
          <SelectInput
            id="transition_operator"
            label="Logic Operator"
            className="w-fit"
            options={OPERATOR_OPTIONS}
            onTextChange={value => handleTransitionUpdate('operator', value)}
            value={transitionData?.operator ?? ''}
            required
          />
        </div>
      </fieldset>
      <LogicEditor
        inputLogicList={inputsLogicList}
        internalsLogicList={internalsLogicList}
        onEditLogic={editLogic}
        onDelete={deleteLogic}
        entityType="Transition"
      />
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
