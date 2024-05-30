import {
  BoxModelIcon,
  ChevronLeftIcon,
  HamburgerMenuIcon,
  QuestionMarkIcon,
} from '@radix-ui/react-icons';
import * as Toolbar from '@radix-ui/react-toolbar';
import {cloneElement, useState} from 'react';
import colors from 'tailwindcss/colors';

import {useGlobal} from '../../contexts/GlobalContext';

interface Props {
  addNewNode: () => void;
}

interface CustomIconProps {
  icon: React.ReactElement;
}

interface CustomButtonProps {
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

function CustomButton({children, onClick, className}: CustomButtonProps) {
  return (
    <Toolbar.Button
      className={`w-16 h-16 btn-canvas ${className}`}
      onClick={onClick}>
      {children}
    </Toolbar.Button>
  );
}

function SideMenu({addNewNode}: Props) {
  const [open, setOpen] = useState(true);
  const {setSettingsOpen} = useGlobal();

  const toggleSettings = () => {
    setSettingsOpen(prev => !prev);
  };

  return (
    <Toolbar.Root
      orientation="vertical"
      className={`relative bottom-1/2 -translate-y-1/2 bg-white rounded-e-2xl shadow-lg border-zinc-300 py-8 px-2 h-96 w-20 flex flex-col gap-2 overflow-visible transition-transform ${open ? '' : '-translate-x-20'}`}>
      <CustomButton onClick={() => {}}>
        {<CustomIcon icon={<QuestionMarkIcon />} />}
      </CustomButton>
      <CustomButton onClick={toggleSettings}>
        {<CustomIcon icon={<HamburgerMenuIcon />} />}
      </CustomButton>
      <CustomButton onClick={addNewNode}>
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
