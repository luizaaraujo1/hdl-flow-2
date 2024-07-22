export enum PortTypeEnum {
  Integer = 'integer',
  Logic = 'logic',
  LogicVector = 'logic_vector',
}

export type PortValue = undefined | number | boolean | string;

interface Port {
  id: string;
  name: string;
  id_name: string;
  type: PortTypeEnum;
  description: string;
  defaultValue: PortValue;
}

export default Port;
