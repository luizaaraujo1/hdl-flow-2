import Port from '../models/port';
import {PortLogic, PortLogicType} from '../models/state';

export function getPortLogicObjectFromPorts(ports: Port[]): {
  [key: string]: PortLogic;
} {
  let portLogic = {};
  ports.forEach(port => {
    portLogic = {
      ...portLogic,
      [port.id]: {port, type: PortLogicType.Default},
    };
  });
  return portLogic;
}
