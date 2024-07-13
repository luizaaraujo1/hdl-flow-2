import {
  ActivityLogIcon,
  ChevronLeftIcon,
  CodeIcon,
  FilePlusIcon,
  QuestionMarkIcon,
} from '@radix-ui/react-icons';
import * as Toolbar from '@radix-ui/react-toolbar';
import {cloneElement, useState} from 'react';
import colors from 'tailwindcss/colors';

import {
  DRAG_AND_DROP_EVENT_NAME,
  NODE_TYPE,
} from '../../../constants/nodes.constants';
import {useDialog} from '../../../contexts/DialogContext';
import MenuButton from './MenuButton';

interface CustomIconProps {
  icon: React.ReactElement;
}

function CustomIcon({icon}: CustomIconProps) {
  return cloneElement(icon, {
    color: colors.zinc['600'],
    className: 'relative h-1/2 w-1/2',
  });
}

function SideMenu() {
  const [open, setOpen] = useState(true);
  const {setPortSettingsOpen} = useDialog();

  const toggleSettings = () => {
    setPortSettingsOpen(prev => !prev);
  };

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: NODE_TYPE,
  ) => {
    event.dataTransfer.setData(DRAG_AND_DROP_EVENT_NAME, nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Toolbar.Root
      orientation="vertical"
      className={`relative bottom-1/2 flex h-96 w-20 -translate-y-1/2 flex-col gap-2 overflow-visible rounded-e-2xl border-zinc-300 bg-white px-2 py-8 shadow-lg transition-transform ${open ? '' : '-translate-x-20'}`}>
      <MenuButton onClick={() => {}} label="How to use">
        {<CustomIcon icon={<QuestionMarkIcon />} />}
      </MenuButton>
      <MenuButton onClick={toggleSettings} label="Open Port editor">
        {<CustomIcon icon={<ActivityLogIcon />} />}
      </MenuButton>
      <MenuButton
        onClick={() => {}}
        onDragStart={event => onDragStart(event, NODE_TYPE.State)}
        className="hover:cursor-grab"
        label="Drag to add State"
        draggable>
        {<CustomIcon icon={<FilePlusIcon />} />}
      </MenuButton>
      <MenuButton onClick={() => {}} label="Code editor">
        {<CustomIcon icon={<CodeIcon />} />}
      </MenuButton>
      <MenuButton
        onClick={() => setOpen(prev => !prev)}
        className={`${open ? '' : 'translate-x-14 -rotate-180'} transition-transform`}>
        {<CustomIcon icon={<ChevronLeftIcon />} />}
      </MenuButton>
    </Toolbar.Root>
  );
}

export default SideMenu;
