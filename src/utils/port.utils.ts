import Port, {PortTypeEnum} from '@models/port';
import {PortLogic, LogicType} from '@models/state';

export function getPortLogicObjectFromPorts(ports: Port[]): {
  [key: string]: PortLogic;
} {
  let portLogic = {};
  ports.forEach(port => {
    portLogic = {
      ...portLogic,
      [port.id]: {port, type: LogicType.Default},
    };
  });
  return portLogic;
}

export function filterPortsOfDifferentType(ports: Port[], type: PortTypeEnum) {
  return ports.filter(port => port.type === type);
}

export function filterSamePort(ports: Port[], id: string) {
  return ports.filter(ports => ports.id !== id);
}
