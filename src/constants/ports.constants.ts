import Port from '@models/port';

export type PortCategory = 'Input' | 'Output' | 'Internal';

export interface TabSchema {
  name: PortCategory;
  portList: Port[];
}
