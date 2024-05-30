export enum PortTypeEnum {
  Integer = 'integer',
  Logic = 'logic',
  LogicVector = 'logic_vector',
}

export type PortDefault = undefined | number | boolean | string;

interface Port {
  id: string;
  name: string;
  id_name: string;
  type: PortTypeEnum;
  description: '';
  defaultValue: PortDefault;
}

export default Port;
