import {
  BoxModelIcon,
  ChevronLeftIcon,
  HamburgerMenuIcon,
  QuestionMarkIcon,
} from '@radix-ui/react-icons';
import * as Toolbar from '@radix-ui/react-toolbar';
import {cloneElement, useState} from 'react';
import colors from 'tailwindcss/colors';

import {NODE_TYPE} from '../../constants/nodes.constants';
import {useGlobal} from '../../contexts/GlobalContext';

interface CustomIconProps {
  icon: React.ReactElement;
}

interface CustomButtonProps extends Toolbar.ToolbarButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

function CustomIcon({icon}: CustomIconProps) {
  return cloneElement(icon, {
    color: colors.zinc['600'],
    className: 'relative h-1/2 w-1/2',
  });
}

function CustomButton({
  children,
  onClick,
  className,
  ...rest
}: CustomButtonProps) {
  return (
    <Toolbar.Button
      className={`btn-canvas h-16 w-16 cursor-pointer ${className}`}
      onClick={onClick}
      {...rest}>
      {children}
    </Toolbar.Button>
  );
}

function SideMenu() {
  const [open, setOpen] = useState(true);
  const {setSettingsOpen} = useGlobal();

  const toggleSettings = () => {
    setSettingsOpen(prev => !prev);
  };

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: NODE_TYPE,
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Toolbar.Root
      orientation="vertical"
      className={`relative bottom-1/2 flex h-96 w-20 -translate-y-1/2 flex-col gap-2 overflow-visible rounded-e-2xl border-zinc-300 bg-white px-2 py-8 shadow-lg transition-transform ${open ? '' : '-translate-x-20'}`}>
      <CustomButton onClick={() => {}}>
        {<CustomIcon icon={<QuestionMarkIcon />} />}
      </CustomButton>
      <CustomButton onClick={toggleSettings}>
        {<CustomIcon icon={<HamburgerMenuIcon />} />}
      </CustomButton>
      <CustomButton
        onClick={() => {}}
        onDragStart={event => onDragStart(event, NODE_TYPE.State)}
        className="cursor-grab"
        draggable>
        {<CustomIcon icon={<BoxModelIcon />} />}
      </CustomButton>
      <CustomButton
        onClick={() => setOpen(prev => !prev)}
        className={`${open ? '' : 'translate-x-14 -rotate-180'} transition-transform`}>
        {<CustomIcon icon={<ChevronLeftIcon />} />}
      </CustomButton>
    </Toolbar.Root>
  );
}

export default SideMenu;
