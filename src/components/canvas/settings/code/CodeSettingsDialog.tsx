import {useDialog} from '../../../../contexts/DialogContext';
import SettingsDialog from '../../../shared/SettingsDialog';

function CodeSettingsDialog() {
  const {codeSettingsOpen, setCodeSettingsOpen} = useDialog();

  return (
    <SettingsDialog
      open={codeSettingsOpen}
      setOpen={setCodeSettingsOpen}
      title={'Code Settings'}
      description={'Use this menu to see the resulting code for your FSM'}>
      <></>
    </SettingsDialog>
  );
}

export default CodeSettingsDialog;
