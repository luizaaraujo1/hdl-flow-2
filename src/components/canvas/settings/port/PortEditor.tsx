import {PlusCircledIcon} from '@radix-ui/react-icons';
import * as Tabs from '@radix-ui/react-tabs';
import {useCallback, useEffect, useMemo} from 'react';

import {PortCategory, TabSchema} from '../../../../constants/ports.constants';
import {useGlobal} from '../../../../contexts/GlobalContext';
import Port, {PortTypeEnum} from '../../../../models/port';
import {
  changeSpacesIntoUnderlines,
  removeAllNonLogical,
  removeAllNonNumeric,
  removeForbiddenChars,
} from '../../../../utils/input';
import {getPortLogicObjectFromPorts} from '../../../../utils/port.utils';
import PortElement from './PortElement';

function PortEditor() {
  const {
    inputList,
    outputList,
    internalsList,
    setInputList,
    setInternalsList,
    setOutputList,
    nodeState: {setNodes},
    edgeState: {setEdges},
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
      type: PortTypeEnum.Logic,
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

  const inputLogic = useMemo(
    () => getPortLogicObjectFromPorts(inputList),
    [inputList],
  );

  const outputsLogic = useMemo(
    () => getPortLogicObjectFromPorts(outputList),
    [outputList],
  );

  const internalsLogic = useMemo(
    () => getPortLogicObjectFromPorts(internalsList),
    [internalsList],
  );

  const updateNodesState = useCallback(() => {
    setNodes(prev =>
      [...prev].map(node => ({
        ...node,
        data: {
          ...node.data,
          portLogic: {
            internals: {...internalsLogic},
            outputs: {...outputsLogic},
          },
        },
      })),
    );
  }, [internalsLogic, outputsLogic, setNodes]);

  const updateEdgesState = useCallback(() => {
    setEdges(prev =>
      [...prev].map(edge => {
        if (edge.data)
          return {
            ...edge,
            data: {
              ...edge.data,
              portLogic: {
                inputs: {...inputLogic},
                internals: {...internalsLogic},
                outputs: {...outputsLogic},
              },
            },
          };
        else return {...edge};
      }),
    );
  }, [inputLogic, internalsLogic, outputsLogic, setEdges]);

  useEffect(() => {
    updateNodesState();
    updateEdgesState();
  }, [updateEdgesState, updateNodesState]);

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

  const getDefaultValueByType = (type: string) => {
    if (type === PortTypeEnum.Integer) return 0;
    if (type === PortTypeEnum.LogicVector) return '000';
    return false;
  };

  const handlePortTypeUpdate = (
    id: string,
    tab: PortCategory,
    value: Port[keyof Port],
  ) => {
    updatePort(
      id,
      getList(tab),
      getListSetter(tab),
      'defaultValue',
      getDefaultValueByType(String(value)),
    );
    updatePort(id, getList(tab), getListSetter(tab), 'type', value);
  };

  const handlePortDefaultValueUpdate = (
    id: string,
    tab: PortCategory,
    value: Port[keyof Port],
  ) => {
    let newValue = value;
    const portList = getList(tab);
    const port = portList.find(port => port.id === id);

    if (port?.type === PortTypeEnum.Integer)
      newValue = removeAllNonNumeric(String(value));
    if (port?.type === PortTypeEnum.LogicVector)
      newValue = removeAllNonLogical(String(value));

    updatePort(id, portList, getListSetter(tab), 'defaultValue', newValue);
  };

  const handlePortUpdate = (
    id: string,
    tab: PortCategory,
    key: keyof Port,
    value: Port[keyof Port],
  ) => {
    if (key === 'name') handlePortNameUpdate(id, tab, value);
    if (key === 'type') handlePortTypeUpdate(id, tab, value);
    if (key === 'defaultValue') handlePortDefaultValueUpdate(id, tab, value);
    else {
      updatePort(id, getList(tab), getListSetter(tab), key, value);
    }
  };

  return (
    <Tabs.Root
      defaultValue={PORT_TABS[0].name}
      className="flex flex-1 flex-col overflow-y-scroll">
      <Tabs.List
        aria-label="Select the type of Port"
        className="sticky -top-0.5 flex w-fit flex-row rounded-r-md border-b-2 border-r-2 bg-white pr-4">
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
            <h3 className="ml-4 text-sm text-gray-500">{`Here, you can edit your FSM's ${tab.name} Ports`}</h3>
          </Tabs.Content>
        ))}
      </Tabs.List>
      {PORT_TABS.map(tab => (
        <Tabs.Content
          key={`${tab.name}_body`}
          value={tab.name}
          className="flex-1 rounded-md rounded-tl-none bg-gray-50 p-4 pr-2 shadow-inner">
          <>
            <div className="mr-16 grid grid-cols-2 gap-2">
              {getList(tab.name).map(port => (
                <PortElement
                  key={`element_${tab.name}_${port.id}`}
                  portCategory={tab.name}
                  port={port}
                  onDelete={() => handlePortDelete(tab.name, port.id)}
                  setPort={(key, value) =>
                    handlePortUpdate(port.id, tab.name, key, value)
                  }
                />
              ))}
            </div>
            <button
              className="btn-canvas fixed bottom-10 right-14 flex p-2"
              onClick={() => handleAddPort(tab.name)}>
              <PlusCircledIcon />
              <h2 className="text-md ml-2 font-semibold">Add New Port</h2>
            </button>
          </>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

export default PortEditor;
