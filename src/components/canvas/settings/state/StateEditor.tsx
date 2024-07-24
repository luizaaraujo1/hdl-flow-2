import {useCallback, useMemo} from 'react';
import {Node} from 'reactflow';

import LogicEditor from '@components/canvas/settings/logic/LogicEditor';
import {PortCategory} from '@constants/ports.constants';
import FSMState, {PortLogic, StatePortLogic} from '@models/state';
import RoundedScrollContainer from '@shared/RoundedScrollContainer';
import TextInput from '@shared/TextInput';
import useStoreDialog from '@store/useStoreDialog';
import useStoreNodes from '@store/useStoreNodes';
import {numericOnlyPattern, removeAllNonNumeric} from '@utils/input';

function StateEditor() {
  const {nodes, setNodes} = useStoreNodes();
  const {selectedStateId} = useStoreDialog();

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
          entityType="State"
        />
      </>
    </RoundedScrollContainer>
  );
}

export default StateEditor;
