import {PortLogic} from '../../../models/state';
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

  return (
    <div className="nowheel max-h-[140px] overflow-y-auto">
      {(hasOutputs || hasInternals) && (
        <>
          {outputsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={portLogic.port.id_name}
              className="bg-white"
              value={String(
                portLogic.customValue ?? portLogic.port.defaultValue,
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
              className="bg-slate-100"
              value={String(
                portLogic.customValue ?? portLogic.port.defaultValue,
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
