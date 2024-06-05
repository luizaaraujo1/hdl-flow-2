import {useGlobal} from '../../../../contexts/GlobalContext';
import SettingsDialog from '../../../shared/SettingsDialog';
import PortEditor from './PortEditor';

function PortSettingsDialog() {
  const {setSettingsOpen, settingsOpen} = useGlobal();

  const PORT_SETTINGS_DISCLAIMERS = [
    'Warning! Set up all your FSM Ports BEFORE customizing yours States in the Canvas.',
    'Each update to this Dialog will reset your edits to States and Transitions. (This will change in a new version. Currently work in progress...)',
  ];

  return (
    <SettingsDialog
      open={settingsOpen}
      setOpen={setSettingsOpen}
      title={'Port Settings'}
      description={'Use this menu to set up the Ports for your FSM'}
      disclaimers={PORT_SETTINGS_DISCLAIMERS}>
      <PortEditor />
    </SettingsDialog>
  );
}

export default PortSettingsDialog;
