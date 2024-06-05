import {GearIcon, TrashIcon} from '@radix-ui/react-icons';
import {cloneElement, useCallback, useState} from 'react';
import {zinc} from 'tailwindcss/colors';

import {PortCategory} from '../../../../constants/ports.constants';
import Port, {PortValue, PortTypeEnum} from '../../../../models/port';
import {logicalOnlyPattern, numericOnlyPattern} from '../../../../utils/input';
import SelectInput from '../../../shared/SelectInput';
import TextInput from '../../../shared/TextInput';
import PortInfo from './PortInfo';

interface Props {
  port: Port;
  portCategory: PortCategory;
  onDelete: () => void;
  setPort: (key: keyof Port, value: Port[keyof Port]) => void;
}

function PortElement({onDelete, portCategory, port, setPort}: Props) {
  const [editing, setEditing] = useState(false);
  const editingStyle = editing ? 'min-h-[200px]' : 'min-h-0 h-0';

  const portTypeOptions = [
    {id: PortTypeEnum.Logic, value: PortTypeEnum.Logic},
    {id: PortTypeEnum.LogicVector, value: PortTypeEnum.LogicVector},
    {id: PortTypeEnum.Integer, value: PortTypeEnum.Integer},
  ];

  const renderDefaultValueInput = useCallback(
    (
      type: PortTypeEnum,
      onChange: (value: string) => void,
      value: PortValue,
    ) => {
      const isLogic = type === PortTypeEnum.Logic;
      const isNumeric = type === PortTypeEnum.Integer;
      const sharedProps = {
        id: 'default_input',
        required: true,
        value: String(value),
        onTextChange: onChange,
      };
      const logicOptions = [
        {id: 'false', value: 'false'},
        {id: 'true', value: 'true'},
      ];
      const helperText = isNumeric ? '(numeric)' : '(binary)';
      return cloneElement(
        isLogic ? (
          <SelectInput
            options={logicOptions}
            label="Default value:"
            {...sharedProps}
          />
        ) : (
          <TextInput
            placeholder="Set the Port's default value"
            label={`Default value: ${helperText}`}
            pattern={isNumeric ? numericOnlyPattern : logicalOnlyPattern}
            {...sharedProps}
          />
        ),
      );
    },
    [],
  );

  return (
    <div className="flex flex-col">
      <fieldset className="flex content-center justify-between rounded-md bg-white p-2 shadow-lg">
        <PortInfo port={port} portCategory={portCategory} />
        <div className="flex items-center gap-4">
          <button
            className="btn-canvas rounded-md p-1"
            onClick={() => setEditing(prev => !prev)}>
            <GearIcon />
          </button>
          <button
            onClick={onDelete}
            aria-selected={editing}
            className="btn-canvas rounded-md border-red-100 bg-rose-100 p-1 hover:border-red-300/60 active:bg-red-200">
            <TrashIcon color={zinc[600]} />
          </button>
        </div>
      </fieldset>
      <div
        className={`rounded-b-md bg-zinc-600/20 shadow-lg transition-[min-height] ease-in-out ${editingStyle}`}>
        {editing && (
          <fieldset className="flex flex-col gap-1 p-2" disabled={!editing}>
            <TextInput
              id="name_input"
              label="Name:"
              onTextChange={value => setPort('name', value)}
              value={port.name}
              placeholder="Write an unique name"
              required
            />
            <TextInput
              id="id_name_input"
              label="ID Name:"
              onTextChange={value => setPort('id_name', value)}
              value={port.id_name}
              placeholder="Don't leave the name empty!"
              required
              disabled
            />
            <SelectInput
              id="type_select"
              label="Select Port Type"
              onTextChange={value => setPort('type', value)}
              value={port.type}
              options={portTypeOptions}
              required
            />
            {renderDefaultValueInput(
              port.type,
              value => setPort('defaultValue', value),
              port.defaultValue,
            )}
            <TextInput
              id="description_input"
              label="Description:"
              onTextChange={value => setPort('description', value)}
              value={port.description}
              placeholder="(optional) Short description"
              expand
              maxLength={60}
            />
          </fieldset>
        )}
      </div>
    </div>
  );
}

export default PortElement;
