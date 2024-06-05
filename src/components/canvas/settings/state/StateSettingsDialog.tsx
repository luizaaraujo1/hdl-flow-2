import {useDialog} from '../../../../contexts/DialogContext';
import SettingsDialog from '../../../shared/SettingsDialog';

function StateSettingsDialog() {
  const {stateSettingsOpen, setStateSettingsOpen, setSelectedState} =
    useDialog();

  const STATE_SETTINGS_DISCLAIMERS = [
    'Warning! If you change your ports you will lose these changes',
  ];

  const onClose = () => setSelectedState(undefined);

  return (
    <SettingsDialog
      open={stateSettingsOpen}
      setOpen={setStateSettingsOpen}
      title={'State Settings'}
      onClose={onClose}
      description={'Use this menu to set up a State'}
      disclaimers={STATE_SETTINGS_DISCLAIMERS}>
      <></>
    </SettingsDialog>
  );
}

export default StateSettingsDialog;
