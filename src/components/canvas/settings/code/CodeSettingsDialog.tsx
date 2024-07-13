import {useDialog} from '../../../../contexts/DialogContext';
import SettingsDialog from '../../../shared/SettingsDialog';
import CodeWorkspace from './CodeWorkspace';

function CodeSettingsDialog() {
  const {codeSettingsOpen, setCodeSettingsOpen} = useDialog();

  return (
    <SettingsDialog
      open={codeSettingsOpen}
      setOpen={setCodeSettingsOpen}
      title={'Code Settings'}
      description={'Use this menu to see the resulting code for your FSM'}>
      <CodeWorkspace />
    </SettingsDialog>
  );
}

export default CodeSettingsDialog;
