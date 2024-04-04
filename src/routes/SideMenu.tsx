import {
  BoxModelIcon,
  ChevronLeftIcon,
  HamburgerMenuIcon,
  QuestionMarkIcon,
} from '@radix-ui/react-icons';
import * as Toolbar from '@radix-ui/react-toolbar';
import {cloneElement, useState} from 'react';
import colors from 'tailwindcss/colors';

interface Props {
  addNewNode: () => void;
}

interface CustomButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

interface CustomIconProps {
  icon: React.ReactElement;
}

function CustomButton({children, onClick, className}: CustomButtonProps) {
  return (
    <Toolbar.Button
      className={`w-16 h-16 border-2 bg-white border-solid border-zinc-100 rounded-3xl shadow-sm hover:border-zinc-300/60 hover:shadow-md transition-colors active:bg-slate-200 active:shadow-lg flex justify-center items-center ${className}`}
      onClick={onClick}>
      {children}
    </Toolbar.Button>
  );
}

function CustomIcon({icon}: CustomIconProps) {
  return cloneElement(icon, {
    color: colors.zinc['600'],
    className: 'relative h-1/2 w-1/2',
  });
}

function SideMenu({addNewNode}: Props) {
  const [open, setOpen] = useState(true);
  return (
    <Toolbar.Root
      orientation="vertical"
      className={`relative bottom-1/2 -translate-y-1/2 bg-white rounded-e-2xl shadow-lg border-zinc-300 py-8 px-2 h-96 w-20 flex flex-col gap-2 overflow-visible transition-transform ${open ? '' : '-translate-x-20'}`}>
      <CustomButton onClick={() => {}}>
        {<CustomIcon icon={<QuestionMarkIcon />} />}
      </CustomButton>
      <CustomButton onClick={() => {}}>
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
