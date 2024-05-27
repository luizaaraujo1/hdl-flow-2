import {
  DownloadIcon,
  GearIcon,
  Link1Icon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import {useState} from 'react';
import {zinc} from 'tailwindcss/colors';

import {PortCategory} from '../../../constants/ports';
import Port from '../../../models/port';

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

  return (
    <div className="flex flex-col">
      <fieldset className="flex justify-between rounded-md shadow-sm p-2 bg-white">
        <div className="flex items-center">
          <PortIcon portType={portType} />
          <h3 className="text-sm font-semibold text-gray-500 ml-4">Name:</h3>
          <h3 className="text-sm font-semibold text-gray-500 ml-2">
            {port.name !== '' ? port.name : 'Unnamed Port'}
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
        className={`bg-zinc-600/20 rounded-b-md transition-[min-height] ease-in-out ${editing ? 'min-h-[200px]' : 'min-h-0 h-0'}`}>
        {editing && (
          <fieldset className="flex flex-col p-2" disabled={!editing}>
            <label
              htmlFor="name_input"
              className="text-sm font-semibold text-gray-600">
              Name:
            </label>
            <input
              className="w-1/2 p-1 rounded-sm"
              type="text"
              id="name_input"
              name="name_input"
              value={port.name}
              onChange={event => {
                event.preventDefault();
                setPort('name', event.target.value);
              }}
            />
            <label
              htmlFor="id_name_input"
              className="text-sm font-semibold text-gray-600 mt-2">
              ID Name:
            </label>
            <input
              className="w-1/2 p-1 rounded-sm bg-gray-200"
              type="text"
              id="id_name_input"
              name="id_name_input"
              value={port.id_name}
              disabled
            />
          </fieldset>
        )}
      </div>
    </div>
  );
}

export default PortElement;
