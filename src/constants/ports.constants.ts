import Port, {PortTypeEnum} from '@models/port';

export type PortCategory = 'Input' | 'Output' | 'Internal';

export interface TabSchema {
  name: PortCategory;
  portList: Port[];
}

export const DEFAULT_CLK_PORT: Port = {
  id: 'clk',
  defaultValue: false,
  name: 'Clock',
  id_name: 'clk',
  type: PortTypeEnum.Logic,
  description: 'Default FSM clock port',
};

export const DEFAULT_RESET_PORT: Port = {
  id: 'reset',
  defaultValue: false,
  name: 'Reset',
  id_name: 'reset',
  type: PortTypeEnum.Logic,
  description: 'Default FSM reset port',
};
