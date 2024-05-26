interface Port {
  id: string;
  name: string;
  type: 'integer' | 'logic' | 'logic_vector';
  defaultValue: undefined | number | boolean | string;
}

export default Port;
