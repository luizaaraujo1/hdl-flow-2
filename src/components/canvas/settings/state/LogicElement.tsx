import {useEffect, useMemo} from 'react';

import {PortCategory} from '../../../../constants/ports.constants';
import {useGlobal} from '../../../../contexts/GlobalContext';
import Port, {PortTypeEnum} from '../../../../models/port';
import {
  LogicType,
  PortLogic,
  SUPPORTED_LOGIC_TYPES,
} from '../../../../models/state';
import SelectInput from '../../../shared/SelectInput';
import PortInfo from '../port/PortInfo';

interface LogicElement {
  logic: PortLogic;
  onEditLogic: (
    portId: string,
    field: keyof PortLogic,
    value: PortLogic[keyof PortLogic],
  ) => void;
  portCategory: PortCategory;
  logicType: 'State' | 'Transition';
}

const filterPortsOfDifferentType = (ports: Port[], type: PortTypeEnum) => {
  return ports.filter(port => port.type === type);
};

const filterSamePort = (ports: Port[], id: string) => {
  return ports.filter(ports => ports.id !== id);
};

const LogicElement = ({
  logic,
  onEditLogic,
  portCategory,
  logicType,
}: LogicElement) => {
  const {inputList, internalsList} = useGlobal();
  const isInternal = portCategory === 'Internal';

  const customValueEqualityLabel = isInternal
    ? 'Select an Internal or Input Port'
    : 'Select an Internal Port';

  const customValueEqualityOptions = useMemo(() => {
    if (logicType === 'State') {
      if (isInternal)
        return filterSamePort(
          filterPortsOfDifferentType(
            [...inputList, ...internalsList],
            logic.port.type,
          ),
          logic.port.id,
        ).map(port => port.id_name);
      return filterSamePort(
        filterPortsOfDifferentType([...internalsList], logic.port.type),
        logic.port.id,
      ).map(port => port.id_name);
    }
    return [];
  }, [
    inputList,
    internalsList,
    isInternal,
    logic.port.id,
    logic.port.type,
    logicType,
  ]);

  const hasCustomValueEqualityOptions = !!customValueEqualityOptions.length;

  const optionsStyle = !hasCustomValueEqualityOptions
    ? 'bg-red-300/20 text-red-500'
    : '';

  const defaultValue = !hasCustomValueEqualityOptions
    ? 'None available'
    : undefined;

  useEffect(() => {
    if (
      logic.type === LogicType.Equality &&
      !logic.customValue &&
      customValueEqualityOptions.length > 0
    )
      onEditLogic(logic.port.id, 'customValue', customValueEqualityOptions[0]);
    if (logic.type === LogicType.Default && !!logic.customValue) {
      onEditLogic(logic.port.id, 'customValue', undefined);
    }
  }, [
    customValueEqualityOptions,
    logic.customValue,
    logic.port.id,
    logic.type,
    onEditLogic,
  ]);

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-3 rounded-md bg-white p-2 shadow-lg">
        <PortInfo port={logic.port} portCategory={portCategory} />
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-nowrap text-sm font-semibold">Port Value:</h3>
          {logic.type === LogicType.Default && (
            <>
              <h3 className="rounded-md bg-slate-200 p-2 font-semibold text-gray-600">
                {String(logic.port.defaultValue)}
              </h3>
              <h3 className="text-sm font-semibold">(default)</h3>
            </>
          )}
          {logic.type === LogicType.Equality && (
            <div className="flex flex-col items-end">
              <SelectInput
                id="customValue_equality_select"
                label={customValueEqualityLabel}
                className={`w-full ${optionsStyle}`}
                onTextChange={newType =>
                  onEditLogic(logic.port.id, 'customValue', newType)
                }
                value={String(logic.customValue)}
                defaultString={defaultValue}
                defaultValue={defaultValue}
                options={customValueEqualityOptions}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <SelectInput
            id="type_select"
            label="Select port operation:"
            onTextChange={newType =>
              onEditLogic(logic.port.id, 'type', newType)
            }
            value={logic.type}
            options={SUPPORTED_LOGIC_TYPES}
          />
        </div>
      </div>
    </div>
  );
};

export default LogicElement;
