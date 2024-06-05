import {PortCategory} from '../../../../constants/ports.constants';
import {PortLogic} from '../../../../models/state';
import LogicElement from './LogicElement';

interface StateLogicEditorProps {
  outputsList: PortLogic[];
  internalsList: PortLogic[];
  onEditLogic: (
    portId: string,
    portCategory: PortCategory,
    field: keyof PortLogic,
    value: PortLogic[keyof PortLogic],
  ) => void;
}

const StateLogicEditor = ({
  outputsList,
  internalsList,
  onEditLogic,
}: StateLogicEditorProps) => {
  const hasOutputs = !!outputsList && outputsList.length > 0;
  const hasInternals = !!internalsList && internalsList.length > 0;
  const marginStyle = hasOutputs ? 'mt-4' : '';

  return (
    <fieldset>
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
              logicType="State"
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
              logicType="State"
            />
          ))}
        </div>
      )}
    </fieldset>
  );
};

export default StateLogicEditor;
