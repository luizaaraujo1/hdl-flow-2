import {useEffect, useMemo, useState} from 'react';
import {zinc} from 'tailwindcss/colors';

import PortInfo from '@components/canvas/settings/port/PortInfo';
import {PortCategory} from '@constants/ports.constants';
import {
  ExpressionItem,
  LogicType,
  logicTypeToVhdlOperator,
  OPERATOR_OPTIONS,
  PortLogic,
  STATE_SUPPORTED_LOGIC_TYPES,
} from '@models/state';
import {TRANSITION_SUPPORTED_LOGIC_TYPES} from '@models/transition';
import {TrashIcon} from '@radix-ui/react-icons';
import SelectInput from '@shared/SelectInput';
import TextInput from '@shared/TextInput';
import useStorePorts from '@store/useStorePorts';
import {filterPortsOfDifferentType} from '@utils/port.utils';

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

function BitRangeSelector({
  valueFrom,
  valueTo,
  onChangeFrom,
  onChangeTo,
  vectorSize,
}: {
  valueFrom?: string;
  valueTo?: string;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;
  vectorSize: number;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-gray-500">[</span>
      <input
        type="number"
        min={0}
        max={vectorSize - 1}
        value={valueFrom ?? ''}
        onChange={e => onChangeFrom(e.target.value)}
        className="w-10 rounded border border-gray-300 px-1 py-0.5 text-xs"
        placeholder="from"
      />
      <span className="text-xs text-gray-500">:</span>
      <input
        type="number"
        min={0}
        max={vectorSize - 1}
        value={valueTo ?? ''}
        onChange={e => onChangeTo(e.target.value)}
        className="w-10 rounded border border-gray-300 px-1 py-0.5 text-xs"
        placeholder="to"
      />
      <span className="text-xs text-gray-500">]</span>
    </div>
  );
}

function LogicElement({
  logic,
  onEditLogic,
  onDelete,
  portCategory,
  entityType,
}: LogicElement) {
  const {inputList, internalsList, outputList} = useStorePorts();

  const isState = entityType === 'State';
  const operator = isState ? '<=' : logicTypeToVhdlOperator(logic.type);

  const CUSTOM_VALUE_EQUALITY_OPTIONS = useMemo(() => {
    if (isState) {
      return filterPortsOfDifferentType(
        [...inputList, ...internalsList],
        logic.port.type,
      ).map(port => ({id: port.id_name, value: port.id_name}));
    } else {
      return filterPortsOfDifferentType(
        [...outputList, ...internalsList],
        logic.port.type,
      ).map(port => ({id: port.id_name, value: port.id_name}));
    }
  }, [
    inputList,
    internalsList,
    logic.port.type,
    logic.port.id,
    isState,
    outputList,
  ]);

  const MAX_CUSTOM_SIZE = 100;

  useEffect(() => {
    if (
      (logic.type === LogicType.Equality ||
        logic.type === LogicType.Inequality) &&
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
    if (
      logic.type === LogicType.Custom &&
      logic.customValue !== '' &&
      !logic.customValue
    ) {
      onEditLogic(logic.port.id, 'customValue', '');
    }
  }, [
    CUSTOM_VALUE_EQUALITY_OPTIONS,
    logic.customValue,
    logic.port.id,
    logic.type,
    onEditLogic,
  ]);

  // --- Expression state ---
  const expression: ExpressionItem[] = (logic as any).expression ?? [
    {port: logic.customValue ? String(logic.customValue) : ''},
  ];

  const handlePortChange = (idx: number, port: string) => {
    const newExpression = expression.map((item, i) =>
      i === idx ? {...item, port} : item,
    );
    onEditLogic(logic.port.id, 'expression', newExpression as any);
  };

  const handleOperatorChange = (idx: number, operator: string) => {
    const newExpression = expression.map((item, i) =>
      i === idx ? {...item, operator} : item,
    );
    onEditLogic(logic.port.id, 'expression', newExpression as any);
  };

  const handleAddExpression = () => {
    const newExpression = [...expression, {operator: '+', port: ''}];
    onEditLogic(logic.port.id, 'expression', newExpression as any);
  };

  const handleRemoveExpression = (idx: number) => {
    const newExpression = expression.filter((_, i) => i !== idx);
    onEditLogic(logic.port.id, 'expression', newExpression as any);
  };

  const getPortOptions = (currentIdx: number) => {
    const options = CUSTOM_VALUE_EQUALITY_OPTIONS.map(port => ({
      id: port.id,
      value: port.value,
    }));

    const currentPort = expression[currentIdx]?.port;
    if (
      currentPort !== undefined &&
      currentPort !== null &&
      currentPort !== '' &&
      !options.some(opt => opt.id === currentPort) &&
      !isNaN(Number(currentPort))
    ) {
      options.push({
        id: String(currentPort),
        value: String(currentPort),
      });
    }

    options.push({
      id: '__manual__',
      value: 'Enter number...',
    });

    return options;
  };

  const [manualEntryIdx, setManualEntryIdx] = useState<number | null>(null);
  const [manualEntryValue, setManualEntryValue] = useState<string>('');

  // Output port logic_vector bit range
  const outputPortDef = [...inputList, ...internalsList, ...outputList].find(
    p => p.id_name === logic.port.id_name,
  );
  const isLogicVectorOutput =
    outputPortDef && outputPortDef.type === 'logic_vector';
  const vectorSizeOutput =
    isLogicVectorOutput && typeof outputPortDef.defaultValue === 'string'
      ? outputPortDef.defaultValue.length
      : undefined;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row flex-wrap items-center justify-between rounded-md bg-white p-2 shadow-lg">
        <PortInfo port={logic.port} portCategory={portCategory} />
        <div className="flex items-center justify-center gap-2">
          {/* Output port bit range selector */}
          {isLogicVectorOutput && vectorSizeOutput && (
            <BitRangeSelector
              valueFrom={logic.from}
              valueTo={logic.to}
              onChangeFrom={v => onEditLogic(logic.port.id, 'from', v)}
              onChangeTo={v => onEditLogic(logic.port.id, 'to', v)}
              vectorSize={vectorSizeOutput}
            />
          )}
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
            logic.type === LogicType.Inequality ||
            logic.type === LogicType.LessThan ||
            logic.type === LogicType.LessThanOrEqual ||
            logic.type === LogicType.GreaterThan ||
            logic.type === LogicType.GreaterThanOrEqual) && (
            <>
              <div className="flex flex-row items-center gap-1">
                {expression.map((item, idx) => {
                  const portDef = [
                    ...inputList,
                    ...internalsList,
                    ...outputList,
                  ].find(p => p.id_name === item.port);
                  const isLogicVector =
                    portDef && portDef.type === 'logic_vector';
                  const vectorSize =
                    isLogicVector && typeof portDef.defaultValue === 'string'
                      ? portDef.defaultValue.length
                      : undefined;
                  return (
                    <div key={idx} className="flex items-center gap-1">
                      {idx > 0 && (
                        <SelectInput
                          id={`operator_select_${idx}`}
                          label="Operator"
                          className="w-16"
                          onTextChange={op => handleOperatorChange(idx, op)}
                          value={item.operator || OPERATOR_OPTIONS[0].id}
                          options={OPERATOR_OPTIONS}
                        />
                      )}
                      {manualEntryIdx === idx ? (
                        <input
                          type="text"
                          className="w-24 rounded border border-gray-300 px-2 py-1 text-sm"
                          autoFocus
                          value={manualEntryValue}
                          onChange={e => setManualEntryValue(e.target.value)}
                          onBlur={() => {
                            if (
                              manualEntryValue.trim() !== '' &&
                              !isNaN(Number(manualEntryValue))
                            ) {
                              handlePortChange(idx, manualEntryValue.trim());
                            }
                            setManualEntryIdx(null);
                            setManualEntryValue('');
                          }}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              if (
                                manualEntryValue.trim() !== '' &&
                                !isNaN(Number(manualEntryValue))
                              ) {
                                handlePortChange(idx, manualEntryValue.trim());
                              }
                              setManualEntryIdx(null);
                              setManualEntryValue('');
                            }
                            if (e.key === 'Escape') {
                              setManualEntryIdx(null);
                              setManualEntryValue('');
                            }
                          }}
                          placeholder="Enter number"
                        />
                      ) : (
                        <>
                          <SelectInput
                            id={`port_select_${idx}`}
                            label={idx === 0 ? 'First Port' : 'Next Port'}
                            className="w-32"
                            onTextChange={port => {
                              if (port === '__manual__') {
                                setManualEntryIdx(idx);
                                setManualEntryValue('');
                              } else {
                                handlePortChange(idx, port);
                              }
                            }}
                            value={item.port}
                            options={getPortOptions(idx)}
                          />
                          {/* Use BitRangeSelector for logic_vector ports */}
                          {isLogicVector && vectorSize && (
                            <BitRangeSelector
                              valueFrom={item.from}
                              valueTo={item.to}
                              onChangeFrom={v => {
                                const newExpression = expression.map((it, i) =>
                                  i === idx ? {...it, from: v} : it,
                                );
                                onEditLogic(
                                  logic.port.id,
                                  'expression',
                                  newExpression as any,
                                );
                              }}
                              onChangeTo={v => {
                                const newExpression = expression.map((it, i) =>
                                  i === idx ? {...it, to: v} : it,
                                );
                                onEditLogic(
                                  logic.port.id,
                                  'expression',
                                  newExpression as any,
                                );
                              }}
                              vectorSize={vectorSize}
                            />
                          )}
                        </>
                      )}
                      {expression.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveExpression(idx)}
                          className="text-red-500"
                          title="Remove">
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={handleAddExpression}
                  className="ml-2 rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  + Add
                </button>
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
            label={
              isState ? 'Select port operation:' : 'Select port condition:'
            }
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
