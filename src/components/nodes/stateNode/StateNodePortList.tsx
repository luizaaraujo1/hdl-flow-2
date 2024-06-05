import {PortCategory} from '../../../constants/ports.constants';
import {PortValue} from '../../../models/port';
import {LogicType, PortLogic} from '../../../models/state';
import StateNodeListElement from './StateNodeListElement';

interface StateNodePortListProps {
  outputsList: PortLogic[];
  internalsList: PortLogic[];
}

function StateNodePortList({
  outputsList,
  internalsList,
}: StateNodePortListProps) {
  const hasOutputs = outputsList.length > 0;
  const hasInternals = internalsList.length > 0;

  const getElementClassName = (
    portCategory: PortCategory,
    logicType: LogicType,
    customValue: PortValue,
  ) => {
    const isInternal = portCategory === 'Internal';
    const elementStyle = isInternal ? 'bg-slate-100' : 'bg-white';
    if (logicType === LogicType.Default) return elementStyle;
    if (customValue) {
      return elementStyle;
    }
    return 'bg-red-300/20 text-red-500';
  };

  return (
    <div className="nowheel max-h-[140px] overflow-y-auto">
      {(hasOutputs || hasInternals) && (
        <>
          {outputsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={portLogic.port.id_name}
              className={getElementClassName(
                'Output',
                portLogic.type,
                portLogic.customValue,
              )}
              value={String(
                portLogic.type === LogicType.Default
                  ? portLogic.port.defaultValue
                  : portLogic.customValue,
              )}
              hideBottomBorder={
                !hasOutputs &&
                outputsList.length > 0 &&
                index === outputsList.length - 1
              }
            />
          ))}
          {internalsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={portLogic.port.id_name}
              className={getElementClassName(
                'Internal',
                portLogic.type,
                portLogic.customValue,
              )}
              value={String(
                portLogic.type === LogicType.Default
                  ? portLogic.port.defaultValue
                  : portLogic.customValue,
              )}
              hideBottomBorder={
                internalsList.length > 0 && index === internalsList.length - 1
              }
            />
          ))}
        </>
      )}
    </div>
  );
}

export default StateNodePortList;
