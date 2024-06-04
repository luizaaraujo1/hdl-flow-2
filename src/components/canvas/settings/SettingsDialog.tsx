import * as Dialog from '@radix-ui/react-dialog';
import {Cross1Icon} from '@radix-ui/react-icons';

import {useGlobal} from '../../../contexts/GlobalContext';
import PortEditor from './PortEditor';

function SettingsDialog() {
  const {setSettingsOpen, settingsOpen} = useGlobal();

  const closeDialog = () => setSettingsOpen(false);

  return (
    <Dialog.Root open={settingsOpen} defaultOpen={false}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 cursor-pointer bg-black/50"
          onClick={closeDialog}
        />
        <Dialog.Content className="center-fixed flex h-4/5 w-4/5 max-w-[1400px] flex-col rounded-md bg-white p-8 shadow-lg transition-all duration-150 ease-in focus:outline-none">
          <Dialog.Close
            onClick={closeDialog}
            className="btn-canvas fixed right-8 top-8 h-8 w-8 rounded-full">
            <Cross1Icon />
          </Dialog.Close>
          <Dialog.Title className="mb-2 text-lg font-semibold">
            Port Settings
          </Dialog.Title>
          <Dialog.Description className="text-md mb-4 font-light">
            Use this menu to set up the Ports for your FSM
          </Dialog.Description>
          <Dialog.Description className="mb-2 text-sm font-light text-slate-800">
            Warning! Set up all your FSM Ports BEFORE customizing yours States
            in the Canvas.
          </Dialog.Description>
          <Dialog.Description className="mb-4 text-sm font-light text-slate-800">
            Each update to this Dialog will reset your States. (This will change
            in a new version. Currently work in progress...)
          </Dialog.Description>
          <PortEditor />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SettingsDialog;
