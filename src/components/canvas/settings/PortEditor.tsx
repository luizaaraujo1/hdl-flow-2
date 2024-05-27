import {PlusCircledIcon} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';

import {PortCategory, TabSchema} from '../../../constants/ports';
import {useGlobal} from '../../../contexts/GlobalContext';
import Port from '../../../models/port';
import {
  changeSpacesIntoUnderlines,
  removeForbiddenChars,
} from '../../../utils/input';
import PortElement from './PortElement';

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
    {name: 'Input', portList: inputList},
    {name: 'Output', portList: outputList},
    {name: 'Internal', portList: internalsList},
  ];

  const getTriggerRound = (index: number) => {
    if (index === 0) return 'rounded-none rounded-tl-md';
    if (index === PORT_TABS.length - 1) return 'rounded-none rounded-tr-md';
    return 'rounded-none';
  };

  const getDefaultPortValues = (tagNumber: number, tab: PortCategory): Port => {
    const lowerCaseTab = tab.toString().toLowerCase();
    const lengthString = tagNumber.toString();
    return {
      id: crypto.randomUUID(),
      name: `Port ${tab} ${lengthString}`,
      id_name: `port_${lowerCaseTab}_${lengthString}`,
      type: 'logic',
      description: '',
      defaultValue: false,
    };
  };

  const getList = (tab: PortCategory) => {
    if (tab === PORT_TABS[0].name) return inputList;
    if (tab === PORT_TABS[1].name) return outputList;
    return internalsList;
  };

  const getListSetter = (tab: PortCategory) => {
    if (tab === PORT_TABS[0].name) return setInputList;
    if (tab === PORT_TABS[1].name) return setOutputList;
    return setInternalsList;
  };

  const handleAddPort = (tab: PortCategory) => {
    const newPort = getDefaultPortValues(getList(tab).length + 1, tab);
    getListSetter(tab)(prev => [...prev, newPort]);
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

  const handlePortDelete = (tab: PortCategory, id: string) => {
    deletePort(id, getList(tab), getListSetter(tab));
  };

  const updatePort = (
    id: string,
    portList: Port[],
    setter: (value: React.SetStateAction<Port[]>) => void,
    key: keyof Port,
    value: Port[keyof Port],
  ) => {
    const index = portList.findIndex(port => port.id === id);
    if (index > -1) {
      setter(prev => {
        const newList = [...prev];
        newList[index] = {...newList[index], [key]: value};
        return newList;
      });
    }
  };

  const handlePortNameUpdate = (
    id: string,
    tab: PortCategory,
    value: Port[keyof Port],
  ) => {
    const name = removeForbiddenChars(String(value ?? ''));
    const id_name = changeSpacesIntoUnderlines(name.trimEnd()).toLowerCase();

    updatePort(id, getList(tab), getListSetter(tab), 'name', name);
    updatePort(id, getList(tab), getListSetter(tab), 'id_name', id_name);
  };

  const handlePortUpdate = (
    id: string,
    tab: PortCategory,
    key: keyof Port,
    value: Port[keyof Port],
  ) => {
    if (key === 'name') handlePortNameUpdate(id, tab, value);
    else {
      updatePort(id, getList(tab), getListSetter(tab), key, value);
    }
  };

  return (
    <Tabs.Root
      defaultValue={PORT_TABS[0].name}
      className="flex flex-col flex-1 overflow-y-scroll">
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
            <h3 className="text-sm font-semibold text-gray-500 ml-4">{`Here, you can edit your FSM's ${tab.name}s`}</h3>
          </Tabs.Content>
        ))}
      </Tabs.List>
      {PORT_TABS.map(tab => (
        <Tabs.Content
          key={`${tab.name}_body`}
          value={tab.name}
          className="rounded-md rounded-tl-none shadow-inner flex-1 p-4 pr-2 bg-gray-50">
          <>
            <div className="grid grid-cols-2 mr-16 gap-2">
              {getList(tab.name).map(port => (
                <PortElement
                  key={`element_${tab.name}_${port.id}`}
                  portType={tab.name}
                  port={port}
                  onDelete={() => handlePortDelete(tab.name, port.id)}
                  setPort={(key, value) =>
                    handlePortUpdate(port.id, tab.name, key, value)
                  }
                />
              ))}
            </div>
            <button
              className="fixed flex btn-canvas p-2 bottom-10 right-14"
              onClick={() => handleAddPort(tab.name)}>
              <PlusCircledIcon />
              <h2 className="text-md font-semibold ml-2">Add New Port</h2>
            </button>
          </>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

export default PortEditor;
