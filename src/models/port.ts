type PortType = 'integer' | 'logic' | 'logic_vector';
type PortDefault = undefined | number | boolean | string;

interface Port {
  id: string;
  name: string;
  id_name: string;
  type: PortType;
  description: '';
  defaultValue: PortDefault;
}

export default Port;
