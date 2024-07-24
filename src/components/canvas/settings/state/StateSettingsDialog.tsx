import SettingsDialog from '@shared/SettingsDialog';
import useStoreDialog from '@store/useStoreDialog';

import StateEditor from './StateEditor';

function StateSettingsDialog() {
  const {stateSettingsOpen, setStateSettingsOpen, setSelectedStateId} =
    useStoreDialog();

  const STATE_SETTINGS_DISCLAIMERS = [
    'Warning! If you change your Ports you will lose these changes',
    'More port operations will be added in a future update (Work in progress)',
  ];

  const onClose = () => setSelectedStateId(undefined);

  return (
    <SettingsDialog
      open={stateSettingsOpen}
      setOpen={setStateSettingsOpen}
      title={'State Settings'}
      onClose={onClose}
      description={'Use this menu to set up a State for your FSM'}
      disclaimers={STATE_SETTINGS_DISCLAIMERS}>
      <StateEditor />
    </SettingsDialog>
  );
}

export default StateSettingsDialog;
