import {PlusCircledIcon, TrashIcon} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import {zinc} from 'tailwindcss/colors';

import {useGlobal} from '../../../contexts/GlobalContext';
import Port from '../../../models/port';

interface TabSchema {
  name: string;
  portList: Port[];
}

function PortEditor() {
  const {
    inputList,
    outputList,
    internalsList,
    setInputList,
    setInternalsList,
    setOutputList,
  } = useGlobal();

  const PORT_TABS: TabSchema[] = [
    {name: 'Inputs', portList: inputList},
    {name: 'Outputs', portList: outputList},
    {name: 'Internals', portList: internalsList},
  ];

  const getTriggerRound = (index: number) => {
    if (index === 0) return 'rounded-none rounded-tl-md';
    if (index === PORT_TABS.length - 1) return 'rounded-none rounded-tr-md';
    return 'rounded-none';
  };

  const handleAddPort = (tab: string) => {
    const newPort: Port = {
      id: crypto.randomUUID(),
      name: '',
      type: 'logic',
      defaultValue: false,
    };
    if (tab === PORT_TABS[0].name) {
      setInputList(prev => [...prev, newPort]);
    }
    if (tab === PORT_TABS[1].name) {
      setOutputList(prev => [...prev, newPort]);
    }
    if (tab === PORT_TABS[2].name) {
      setInternalsList(prev => [...prev, newPort]);
    }
  };

  const getList = (tab: string) => {
    if (tab === PORT_TABS[0].name) return inputList;
    if (tab === PORT_TABS[1].name) return outputList;
    if (tab === PORT_TABS[2].name) return internalsList;
    return [];
  };

  const deletePort = (
    id: string,
    portList: Port[],
    setter: (value: React.SetStateAction<Port[]>) => void,
  ) => {
    const index = portList.findIndex(port => port.id === id);
    if (index > -1) {
      setter(prev => {
        const newList = [...prev];
        newList.splice(index, 1);
        return newList;
      });
    }
  };

  const handlePortDelete = (tab: string, id: string) => {
    if (tab === PORT_TABS[0].name) {
      deletePort(id, inputList, setInputList);
    }
    if (tab === PORT_TABS[1].name) {
      deletePort(id, outputList, setOutputList);
    }
    if (tab === PORT_TABS[2].name) {
      deletePort(id, internalsList, setInternalsList);
    }
  };

  return (
    <Tabs.Root
      defaultValue={PORT_TABS[0].name}
      className="flex flex-col flex-1 overflow-y-auto">
      <Tabs.List
        aria-label="Select the type of Port"
        className="flex flex-row bg-white sticky -top-0.5 border-r-2 border-b-2 w-fit pr-4 rounded-r-md">
        {PORT_TABS.map((tab, index) => (
          <Tabs.Trigger
            key={`${tab.name}_trigger`}
            value={tab.name}
            className={`btn-canvas p-2 ${getTriggerRound(index)}`}>
            {tab.name}
          </Tabs.Trigger>
        ))}
        {PORT_TABS.map(tab => (
          <Tabs.Content
            key={`${tab.name}_label`}
            value={tab.name}
            className="flex items-center">
            <h3 className="text-sm font-semibold text-gray-500 ml-4">{`Select your ${tab.name}`}</h3>
          </Tabs.Content>
        ))}
      </Tabs.List>
      {PORT_TABS.map(tab => (
        <Tabs.Content
          key={`${tab.name}_body`}
          value={tab.name}
          className="rounded-md rounded-tl-none shadow-inner flex-1 p-4 bg-gray-50">
          <>
            <div className="grid grid-cols-2 mr-16 gap-2">
              {getList(tab.name).map(port => (
                <fieldset
                  key={port.id}
                  className="flex justify-between rounded-md shadow-sm p-2 bg-white">
                  <h3>{port.id}</h3>
                  <button
                    onClick={() => handlePortDelete(tab.name, port.id)}
                    className="btn-canvas bg-rose-100 border-red-100 hover:border-red-300/60 active:bg-red-200 rounded-md p-1">
                    <TrashIcon color={zinc[600]} />
                  </button>
                </fieldset>
              ))}
            </div>
            <button
              className="fixed flex btn-canvas p-2 bottom-10 right-10"
              onClick={() => handleAddPort(tab.name)}>
              <PlusCircledIcon />
              <h2 className="text-md font-semibold ml-2">Add new port</h2>
            </button>
          </>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

export default PortEditor;
