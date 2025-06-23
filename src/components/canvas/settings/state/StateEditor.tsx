import {useCallback, useEffect, useMemo, useState} from 'react';
import {Node} from 'reactflow';

import LogicEditor from '@components/canvas/settings/logic/LogicEditor';
import {PortCategory} from '@constants/ports.constants';
import Port from '@models/port';
import FSMState, {PortLogic, StatePortLogic} from '@models/state';
import RoundedScrollContainer from '@shared/RoundedScrollContainer';
import TextInput from '@shared/TextInput';
import useStoreDialog from '@store/useStoreDialog';
import useStoreNodes from '@store/useStoreNodes';
import useStorePorts from '@store/useStorePorts';
import {numericOnlyPattern, removeAllNonNumeric} from '@utils/input';
import {getPortLogicObjectFromPorts} from '@utils/port.utils';

import TransitionConditionAdder from '../transition/TransitionConditionAdder';

function StateEditor() {
  const {nodes, setNodes} = useStoreNodes();
  const {selectedStateId} = useStoreDialog();
  const {outputList, internalsList} = useStorePorts();

  const [selectedOutputId, setSelectedOutputId] = useState<string | undefined>(
    undefined,
  );
  const [selectedInternalId, setSelectedInternalId] = useState<
    string | undefined
  >(undefined);

  const currentNode = useMemo(
    () => nodes.find(node => node.id === selectedStateId),
    [nodes, selectedStateId],
  );

  const stateData = useMemo(() => currentNode?.data, [currentNode?.data]);

  const outputsLogicList = useMemo(() => {
    if (stateData?.portLogic.outputs) {
      return Object.values(stateData?.portLogic.outputs);
    }
    return [];
  }, [stateData?.portLogic.outputs]);

  const internalsLogicList = useMemo(() => {
    if (stateData?.portLogic.internals) {
      return Object.values(stateData?.portLogic.internals);
    }
    return [];
  }, [stateData?.portLogic.internals]);

  const handleNodeUpdate = useCallback(
    (
      field: keyof Node<FSMState>,
      value: Node<FSMState>[keyof Node<FSMState>],
    ) => {
      if (selectedStateId && currentNode) {
        const newNode = {...currentNode, [field]: value};
        const newNodes = [...nodes].filter(node => node.id !== selectedStateId);
        newNodes.push(newNode);
        setNodes(newNodes);
      }
    },
    [currentNode, nodes, selectedStateId, setNodes],
  );

  const handleStateUpdate = useCallback(
    (field: keyof FSMState, value: FSMState[keyof FSMState]) => {
      if (selectedStateId && currentNode) {
        let newValue = value;
        if (field === 'stateNumber')
          newValue = Number(removeAllNonNumeric(String(newValue)));
        const newData = {...currentNode.data, [field]: newValue};
        handleNodeUpdate('data', newData);
      }
    },
    [currentNode, handleNodeUpdate, selectedStateId],
  );

  const addLogic = useCallback(
    (portId: string, portCategory: PortCategory) => {
      const isInternal = portCategory === 'Internal';
      const portLogicCategory: keyof StatePortLogic = isInternal
        ? 'internals'
        : 'outputs';
      let newPort: Port | undefined;

      if (isInternal) newPort = internalsList.find(port => port.id === portId);
      else newPort = outputList.find(port => port.id === portId);

      if (newPort) {
        const newPortLogicValue = getPortLogicObjectFromPorts([newPort]);
        if (stateData) {
          const currentPortLogicObject = stateData.portLogic[portLogicCategory];
          const newPortLogic = {
            ...currentPortLogicObject,
            ...newPortLogicValue,
          };
          const newTransitionPortLogic: StatePortLogic = {
            ...stateData.portLogic,
            [portLogicCategory]: newPortLogic,
          };
          handleStateUpdate('portLogic', newTransitionPortLogic);
          if (isInternal) setSelectedInternalId(undefined);
          else setSelectedOutputId(undefined);
        }
      }
    },
    [handleStateUpdate, outputList, internalsList, stateData],
  );

  const editLogic = useCallback(
    (
      portId: string,
      portCategory: PortCategory,
      field: keyof PortLogic,
      value: PortLogic[keyof PortLogic],
    ) => {
      const isInternal = portCategory === 'Internal';
      const portLogicCategory: keyof StatePortLogic = isInternal
        ? 'internals'
        : 'outputs';

      if (stateData?.portLogic) {
        const currentPortLogicObject = stateData.portLogic[portLogicCategory];
        const oldPortLogic = currentPortLogicObject[portId];
        const newPortLogic = {
          ...currentPortLogicObject,
          [portId]: {...oldPortLogic, [field]: value},
        };
        const newStatePortLogic: StatePortLogic = {
          ...stateData.portLogic,
          [portLogicCategory]: newPortLogic,
        };
        handleStateUpdate('portLogic', newStatePortLogic);
      }
    },
    [handleStateUpdate, stateData?.portLogic],
  );

  const deleteLogic = useCallback(
    (portId: string, portCategory: PortCategory) => {
      const isInternal = portCategory === 'Internal';
      const portLogicCategory: keyof StatePortLogic = isInternal
        ? 'internals'
        : 'outputs';

      if (stateData?.portLogic) {
        const currentPortLogicObject = stateData.portLogic[portLogicCategory];
        const newPortLogic = {...currentPortLogicObject};
        delete newPortLogic[portId];
        const newTransitionPortLogic: StatePortLogic = {
          ...stateData.portLogic,
          [portLogicCategory]: newPortLogic,
        };
        handleStateUpdate('portLogic', newTransitionPortLogic);
      }
    },
    [handleStateUpdate, stateData?.portLogic],
  );

  const handleAddCondition = useCallback(
    (portCategory: PortCategory) => {
      if (selectedOutputId && portCategory === 'Output') {
        addLogic(selectedOutputId, 'Output');
      }
      if (selectedInternalId && portCategory === 'Internal') {
        addLogic(selectedInternalId, 'Internal');
      }
    },
    [addLogic, selectedOutputId, selectedInternalId],
  );

  const handleSelectOutput = (id: string) => setSelectedOutputId(id);

  const handleSelectInternal = (id: string) => setSelectedInternalId(id);

  const OUTPUT_OPTIONS = useMemo(
    () =>
      [...outputList]
        .map(port => ({
          id: port.id,
          value: port.id_name,
        }))
        .filter(
          element =>
            !outputsLogicList.find(logic => logic.port.id === element.id),
        ),
    [outputList, outputsLogicList],
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
    if (OUTPUT_OPTIONS.length > 0 && !selectedOutputId)
      setSelectedOutputId(OUTPUT_OPTIONS[0].id);
    if (INTERNAL_OPTIONS.length > 0 && !selectedInternalId)
      setSelectedInternalId(INTERNAL_OPTIONS[0].id);
  }, [OUTPUT_OPTIONS, INTERNAL_OPTIONS, selectedOutputId, selectedInternalId]);

  return (
    <RoundedScrollContainer>
      <>
        <fieldset className="mb-4 mr-16 grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <TextInput
              id="state_name"
              label="State Name"
              placeholder="Give this State a name"
              onTextChange={value => handleStateUpdate('name', value)}
              value={stateData?.name ?? ''}
              required
            />
          </div>
          <div className="flex flex-col">
            <TextInput
              id="state_number"
              label="State Number"
              placeholder="Set a unique number for this State"
              onTextChange={value => handleStateUpdate('stateNumber', value)}
              pattern={numericOnlyPattern}
              value={String(stateData?.stateNumber) ?? ''}
              required
            />
          </div>
        </fieldset>
        <LogicEditor
          outputsLogicList={outputsLogicList}
          internalsLogicList={internalsLogicList}
          onEditLogic={editLogic}
          onDelete={deleteLogic}
          entityType="State"
        />
        <div className="pb-20" />
        <TransitionConditionAdder
          selectLabel="Output Port"
          selectedId={selectedOutputId ?? ''}
          addLabel="Add New Output Condition"
          onSelect={id => handleSelectOutput(id)}
          onAdd={() => handleAddCondition('Output')}
          options={OUTPUT_OPTIONS}
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
      </>
    </RoundedScrollContainer>
  );
}

export default StateEditor;
