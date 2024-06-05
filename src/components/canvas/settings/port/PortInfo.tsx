import {PortCategory} from '../../../../constants/ports.constants';
import Port from '../../../../models/port';
import PortIcon from '../../../shared/PortIcon';

interface PortInfoProps {
  port: Port;
  portCategory: PortCategory;
}

const PortInfo = ({port, portCategory}: PortInfoProps) => {
  const isUnnamed = port.name === '';
  return (
    <div className="flex items-center">
      <PortIcon portCategory={portCategory} />
      <h3 className="ml-4 text-sm font-semibold text-gray-500">Name:</h3>
      <h3
        className={`text-sm font-semibold ${isUnnamed ? 'text-red-500' : 'text-gray-500'} ml-2`}>
        {!isUnnamed ? port.name : 'Unnamed Port!'}
      </h3>
      <h2 className="ml-4 text-sm font-semibold text-gray-500">-</h2>
      <h3 className="ml-4 text-sm font-semibold">Type:</h3>
      <h3 className="ml-2 text-sm font-semibold">{port.type}</h3>
    </div>
  );
};

export default PortInfo;
