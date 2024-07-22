import {useDialog} from '@contexts/DialogContext';
import SettingsDialog from '@shared/SettingsDialog';

import CodeWorkspace from './CodeWorkspace';

function CodeResultDialog() {
  const {codeResultOpen, setCodeResultOpen} = useDialog();

  return (
    <SettingsDialog
      open={codeResultOpen}
      setOpen={setCodeResultOpen}
      title={'Code Results'}
      description={'Use this menu to see the resulting code for your FSM'}>
      <CodeWorkspace />
    </SettingsDialog>
  );
}

export default CodeResultDialog;
