import {PortCategory} from '@constants/ports.constants';
import {DownloadIcon, Link1Icon, UploadIcon} from '@radix-ui/react-icons';

interface IconProps {
  portCategory: PortCategory;
}

function PortIcon({portCategory: portType}: IconProps) {
  if (portType === 'Input') return <DownloadIcon />;
  if (portType === 'Output') return <UploadIcon />;
  return <Link1Icon />;
}

export default PortIcon;
