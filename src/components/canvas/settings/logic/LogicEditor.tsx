import {PortCategory} from '../../../../constants/ports.constants';
import {PortLogic} from '../../../../models/state';
import LogicElement from './LogicElement';

export type EntityType = 'State' | 'Transition';

interface LogicEditorProps {
  inputLogicList?: PortLogic[];
  outputsLogicList?: PortLogic[];
  internalsLogicList?: PortLogic[];
  onEditLogic: (
    portId: string,
    portCategory: PortCategory,
    field: keyof PortLogic,
    value: PortLogic[keyof PortLogic],
  ) => void;
  entityType: EntityType;
  onDelete?: (portId: string, portCategory: PortCategory) => void;
}

function LogicEditor({
  inputLogicList: inputsList,
  outputsLogicList: outputsList,
  internalsLogicList: internalsList,
  onEditLogic,
  entityType,
  onDelete,
}: LogicEditorProps) {
  const hasInputs = !!inputsList && inputsList.length > 0;
  const hasOutputs = !!outputsList && outputsList.length > 0;
  const hasInternals = !!internalsList && internalsList.length > 0;
  const marginStyle = hasOutputs || hasInputs ? 'mt-4' : '';
  const isTransition = entityType === 'Transition';
  const paddingStyle = isTransition ? 'pb-20' : '';

  return (
    <fieldset className={paddingStyle}>
      {hasInputs && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-600">Inputs</h3>
          {inputsList.map(logic => (
            <LogicElement
              key={`input_${logic.port.id}`}
              logic={logic}
              onEditLogic={(portId, field, value) =>
                onEditLogic(portId, 'Input', field, value)
              }
              portCategory="Input"
              entityType={entityType}
              onDelete={
                onDelete ? portId => onDelete(portId, 'Input') : undefined
              }
            />
          ))}
        </div>
      )}
      {hasOutputs && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-600">Outputs</h3>
          {outputsList.map(logic => (
            <LogicElement
              key={`output_${logic.port.id}`}
              logic={logic}
              onEditLogic={(portId, field, value) =>
                onEditLogic(portId, 'Output', field, value)
              }
              portCategory="Output"
              entityType={entityType}
              onDelete={
                onDelete ? portId => onDelete(portId, 'Output') : undefined
              }
            />
          ))}
        </div>
      )}
      {hasInternals && (
        <div className={`flex flex-col gap-2 ${marginStyle}`}>
          <h3 className="text-sm font-semibold text-gray-600">Internals</h3>
          {internalsList.map(logic => (
            <LogicElement
              key={`internal_${logic.port.id}`}
              logic={logic}
              onEditLogic={(portId, field, value) =>
                onEditLogic(portId, 'Internal', field, value)
              }
              portCategory="Internal"
              entityType={entityType}
              onDelete={
                onDelete ? portId => onDelete(portId, 'Internal') : undefined
              }
            />
          ))}
        </div>
      )}
    </fieldset>
  );
}

export default LogicEditor;
