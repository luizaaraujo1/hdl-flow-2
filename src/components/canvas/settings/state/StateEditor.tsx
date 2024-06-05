import {useMemo} from 'react';
import {Node} from 'reactflow';

import {useDialog} from '../../../../contexts/DialogContext';
import {useGlobal} from '../../../../contexts/GlobalContext';
import FSMState from '../../../../models/state';
import {numericOnlyPattern, removeAllNonNumeric} from '../../../../utils/input';
import TextInput from '../../../shared/TextInput';

const StateEditor = () => {
  const {selectedState} = useDialog();
  const {
    nodeState: {nodes, setNodes},
  } = useGlobal();

  const currentNode = useMemo(
    () => nodes.find(node => node.id === selectedState?.nodeId),
    [nodes, selectedState?.nodeId],
  );

  const stateData = useMemo(() => currentNode?.data, [currentNode?.data]);

  const handleNodeUpdate = (
    field: keyof Node<FSMState>,
    value: Node<FSMState>[keyof Node<FSMState>],
  ) => {
    if (selectedState?.nodeId && currentNode) {
      const newNode = {...currentNode, [field]: value};
      const newNodes = [...nodes].filter(
        node => node.id !== selectedState.nodeId,
      );
      newNodes.push(newNode);
      setNodes(newNodes);
    }
  };

  const handleStateUpdate = (
    field: keyof FSMState,
    value: FSMState[keyof FSMState],
  ) => {
    if (selectedState?.nodeId && currentNode) {
      let newValue = value;
      if (field === 'stateNumber')
        newValue = Number(removeAllNonNumeric(String(newValue)));
      const newData = {...currentNode.data, [field]: newValue};
      handleNodeUpdate('data', newData);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-scroll">
      <div className="flex-1 rounded-md rounded-tl-none bg-gray-50 p-4 pr-2 shadow-inner">
        <fieldset className="mr-16 grid grid-cols-2 gap-2">
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
      </div>
    </div>
  );
};

export default StateEditor;
