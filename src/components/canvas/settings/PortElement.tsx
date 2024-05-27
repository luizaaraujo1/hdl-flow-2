import {
  DownloadIcon,
  GearIcon,
  Link1Icon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import {cloneElement, useCallback, useState} from 'react';
import {zinc} from 'tailwindcss/colors';

import {PortCategory} from '../../../constants/ports';
import Port, {PortDefault, PortTypeEnum} from '../../../models/port';
import PortSelectInput from './PortSelectInput';
import PortTextInput from './PortTextInput';

interface Props {
  port: Port;
  portType: PortCategory;
  onDelete: () => void;
  setPort: (key: keyof Port, value: Port[keyof Port]) => void;
}

interface IconProps {
  portType: PortCategory;
}

function PortIcon({portType}: IconProps) {
  if (portType === 'Input') return <DownloadIcon />;
  if (portType === 'Output') return <UploadIcon />;
  return <Link1Icon />;
}

function PortElement({onDelete, portType, port, setPort}: Props) {
  const [editing, setEditing] = useState(false);
  const isUnnamed = port.name === '';
  const editingStyle = editing ? 'min-h-[200px]' : 'min-h-0 h-0';

  const renderDefaultValueInput = useCallback(
    (
      type: PortTypeEnum,
      onChange: (value: string) => void,
      value: PortDefault,
    ) => {
      const isLogic = type === PortTypeEnum.Logic;
      const sharedProps = {
        id: 'default_input',
        label: 'Default Value:',
        required: true,
        value: String(value),
        onChange,
      };
      return cloneElement(
        isLogic ? (
          <PortSelectInput options={['false', 'true']} {...sharedProps} />
        ) : (
          <PortTextInput
            placeholder="Set the Port's default value"
            {...sharedProps}
          />
        ),
      );
    },
    [],
  );

  return (
    <div className="flex flex-col">
      <fieldset className="flex justify-between rounded-md shadow-lg p-2 bg-white">
        <div className="flex items-center">
          <PortIcon portType={portType} />
          <h3 className="text-sm font-semibold text-gray-500 ml-4">Name:</h3>
          <h3
            className={`text-sm font-semibold ${isUnnamed ? 'text-red-500' : 'text-gray-500'} ml-2`}>
            {!isUnnamed ? port.name : 'Unnamed Port!'}
          </h3>
          <h2 className="text-sm font-semibold text-gray-500 ml-4">-</h2>
          <h3 className="text-sm font-semibold ml-4">Type:</h3>
          <h3 className="text-sm font-semibold ml-2">{port.type}</h3>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="btn-canvas rounded-md p-1"
            onClick={() => setEditing(prev => !prev)}>
            <GearIcon />
          </button>
          <button
            onClick={onDelete}
            aria-selected={editing}
            className="btn-canvas bg-rose-100 border-red-100 hover:border-red-300/60 active:bg-red-200 rounded-md p-1">
            <TrashIcon color={zinc[600]} />
          </button>
        </div>
      </fieldset>
      <div
        className={`bg-zinc-600/20 rounded-b-md transition-[min-height] ease-in-out shadow-lg ${editingStyle}`}>
        {editing && (
          <fieldset className="flex flex-col p-2 gap-1" disabled={!editing}>
            <PortTextInput
              id="name_input"
              label="Name:"
              onChange={value => setPort('name', value)}
              value={port.name}
              placeholder="Write an unique name"
              required
            />
            <PortTextInput
              id="id_name_input"
              label="ID Name:"
              onChange={value => setPort('id_name', value)}
              value={port.id_name}
              placeholder="Don't leave the name empty!"
              required
              disabled
            />
            <PortSelectInput
              id="type_select"
              label="Select Port Type"
              onChange={value => setPort('type', value)}
              value={port.type}
              options={[
                PortTypeEnum.Logic,
                PortTypeEnum.LogicVector,
                PortTypeEnum.Integer,
              ]}
              required
            />
            {renderDefaultValueInput(
              port.type,
              value => setPort('defaultValue', value),
              port.defaultValue,
            )}
            <PortTextInput
              id="description_input"
              label="Description:"
              onChange={value => setPort('description', value)}
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
