import {useEffect, useMemo} from 'react';
import {zinc} from 'tailwindcss/colors';

import PortInfo from '@components/canvas/settings/port/PortInfo';
import {PortCategory} from '@constants/ports.constants';
import {useGlobal} from '@contexts/GlobalContext';
import {LogicType, PortLogic, STATE_SUPPORTED_LOGIC_TYPES} from '@models/state';
import {TRANSITION_SUPPORTED_LOGIC_TYPES} from '@models/transition';
import {TrashIcon} from '@radix-ui/react-icons';
import SelectInput from '@shared/SelectInput';
import TextInput from '@shared/TextInput';
import {filterPortsOfDifferentType, filterSamePort} from '@utils/port.utils';

import {EntityType} from './LogicEditor';

interface LogicElement {
  logic: PortLogic;
  onEditLogic: (
    portId: string,
    field: keyof PortLogic,
    value: PortLogic[keyof PortLogic],
  ) => void;
  portCategory: PortCategory;
  entityType: EntityType;
  onDelete?: (portId: string) => void;
}

function LogicElement({
  logic,
  onEditLogic,
  onDelete,
  portCategory,
  entityType,
}: LogicElement) {
  const {inputList, internalsList, outputList} = useGlobal();
  const isInternal = portCategory === 'Internal';
  const isState = entityType === 'State';
  const isInequality = logic.type === LogicType.Inequality;
  const operator = isState ? '<=' : isInequality ? '/=' : '=';

  const customValueEqualityLabel = isInternal
    ? 'Select an Internal or Input Port'
    : isState
      ? 'Select an Internal Port'
      : 'Select an Internal or Output Port';

  const CUSTOM_VALUE_EQUALITY_OPTIONS = useMemo(() => {
    if (isInternal)
      return filterSamePort(
        filterPortsOfDifferentType(
          [...inputList, ...internalsList],
          logic.port.type,
        ),
        logic.port.id,
      ).map(port => ({id: port.id, value: port.id_name}));
    if (isState) {
      return filterSamePort(
        filterPortsOfDifferentType([...internalsList], logic.port.type),
        logic.port.id,
      ).map(port => ({id: port.id, value: port.id_name}));
    } else {
      return filterSamePort(
        filterPortsOfDifferentType(
          [...outputList, ...internalsList],
          logic.port.type,
        ),
        logic.port.id,
      ).map(port => ({id: port.id, value: port.id_name}));
    }
  }, [
    isInternal,
    inputList,
    internalsList,
    logic.port.type,
    logic.port.id,
    isState,
    outputList,
  ]);

  const hasCustomValueEqualityOptions = !!CUSTOM_VALUE_EQUALITY_OPTIONS.length;

  const optionsStyle = !hasCustomValueEqualityOptions
    ? 'bg-red-300/20 text-red-500'
    : '';

  const defaultOption = !hasCustomValueEqualityOptions
    ? {id: 'null', value: 'None available'}
    : undefined;

  const MAX_CUSTOM_SIZE = 100;

  useEffect(() => {
    if (
      logic.type === LogicType.Equality &&
      !logic.customValue &&
      CUSTOM_VALUE_EQUALITY_OPTIONS.length > 0
    )
      onEditLogic(
        logic.port.id,
        'customValue',
        CUSTOM_VALUE_EQUALITY_OPTIONS[0].value,
      );
    if (logic.type === LogicType.Default && !!logic.customValue) {
      onEditLogic(logic.port.id, 'customValue', undefined);
    }
    if (logic.type === LogicType.Custom && !logic.customValue) {
      onEditLogic(logic.port.id, 'customValue', '');
    }
  }, [
    CUSTOM_VALUE_EQUALITY_OPTIONS,
    logic.customValue,
    logic.port.id,
    logic.type,
    onEditLogic,
  ]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between rounded-md bg-white p-2 shadow-lg">
        <PortInfo port={logic.port} portCategory={portCategory} />
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-nowrap text-sm font-semibold">
            {`${logic.port.id_name} ${operator}`}
          </h3>
          {logic.type === LogicType.Default && (
            <>
              <h3 className="rounded-md bg-slate-200 p-2 font-semibold text-gray-600">
                {String(logic.port.defaultValue)}
              </h3>
            </>
          )}
          {(logic.type === LogicType.Equality ||
            logic.type === LogicType.Inequality) && (
            <>
              <div className="flex flex-col items-end">
                <SelectInput
                  id="customValue_equality_select"
                  label={customValueEqualityLabel}
                  className={`w-full ${optionsStyle}`}
                  onTextChange={newType =>
                    onEditLogic(logic.port.id, 'customValue', newType)
                  }
                  value={String(logic.customValue)}
                  defaultOption={defaultOption}
                  options={CUSTOM_VALUE_EQUALITY_OPTIONS}
                />
              </div>
            </>
          )}
          {logic.type === LogicType.Custom && (
            <>
              <div className="flex flex-col items-end">
                <TextInput
                  id="customValue_custom_text"
                  label="Write a custom VHDL line"
                  className="w-full"
                  onTextChange={text =>
                    onEditLogic(logic.port.id, 'customValue', text)
                  }
                  placeholder="Don't leave it empty!"
                  value={String(logic.customValue)}
                  maxLength={MAX_CUSTOM_SIZE}
                  required
                />
              </div>
            </>
          )}
          <h3 className="text-nowrap text-sm font-semibold">;</h3>
        </div>
        <div className="flex flex-col items-end">
          <SelectInput
            id="type_select"
            label="Select port operation:"
            className="w-full"
            onTextChange={newType =>
              onEditLogic(logic.port.id, 'type', newType)
            }
            value={logic.type}
            options={
              isState
                ? STATE_SUPPORTED_LOGIC_TYPES
                : TRANSITION_SUPPORTED_LOGIC_TYPES
            }
          />
        </div>
        {!!onDelete && (
          <button
            onClick={() => onDelete(logic.port.id)}
            className="btn-canvas h-fit rounded-md border-red-100 bg-rose-100 p-1 hover:border-red-300/60 active:bg-red-200">
            <TrashIcon color={zinc[600]} />
          </button>
        )}
      </div>
    </div>
  );
}

export default LogicElement;
