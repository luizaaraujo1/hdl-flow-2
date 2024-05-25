import * as Dialog from '@radix-ui/react-dialog';
import {Cross1Icon} from '@radix-ui/react-icons';

import {useGlobal} from '../../../contexts/GlobalContext';

function SettingsDialog() {
  const {setSettingsOpen, settingsOpen} = useGlobal();

  const closeDialog = () => setSettingsOpen(false);

  return (
    <Dialog.Root open={settingsOpen} defaultOpen={false}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="bg-black opacity-80 fixed inset-0 ease-in-out cursor-pointer"
          onClick={closeDialog}
        />
        <Dialog.Content className="bg-white rounded-md shadow-lg center-fixed ease-in-out duration-150 w-4/5 max-w-[1400px] h-2/3 focus:outline-none p-8">
          <Dialog.Title className="text-lg font-semibold mb-2">
            Project Settings
          </Dialog.Title>
          <Dialog.Description className='"text-lg font-light mb-8"'>
            Use this menu to set up the ports for your FSM
          </Dialog.Description>
          <Dialog.Close onClick={closeDialog}>
            <button className="btn-canvas rounded-full w-8 h-8 fixed top-8 right-8">
              <Cross1Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default SettingsDialog;
