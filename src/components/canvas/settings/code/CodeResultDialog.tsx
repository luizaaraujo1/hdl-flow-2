import SettingsDialog from '@shared/SettingsDialog';
import useStoreDialog from '@store/useStoreDialog';

import CodeWorkspace from './CodeWorkspace';

function CodeResultDialog() {
  const {codeResultOpen, setCodeResultOpen} = useStoreDialog();

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
