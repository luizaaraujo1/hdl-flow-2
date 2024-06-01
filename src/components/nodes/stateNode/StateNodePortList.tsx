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
  return (
    <div className="nowheel max-h-[140px] overflow-y-scroll">
      {(outputsList.length > 0 || internalsList.length > 0) && (
        <>
          {outputsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={portLogic.port.id_name}
              value={String(
                portLogic.customValue ?? portLogic.port.defaultValue,
              )}
              hideBottomBorder={index === outputsList.length - 1}
            />
          ))}
          {internalsList.map((portLogic, index) => (
            <StateNodeListElement
              key={portLogic.port.id}
              name={portLogic.port.id_name}
              value={String(
                portLogic.customValue ?? portLogic.port.defaultValue,
              )}
              hideBottomBorder={index === outputsList.length - 1}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default StateNodePortList;
