import {useDialog} from '../../../../contexts/DialogContext';
import SettingsDialog from '../../../shared/SettingsDialog';

function TransitionSettingsDialog() {
  const {
    transitionSettingsOpen,
    setTransitionSettingsOpen,
    setSelectedTransition,
  } = useDialog();

  const TRANSITION_SETTINGS_DISCLAIMERS = [
    'Warning! If you change your ports you will lose these changes',
  ];

  const onClose = () => setSelectedTransition(undefined);

  return (
    <SettingsDialog
      open={transitionSettingsOpen}
      setOpen={setTransitionSettingsOpen}
      title={'Transition Settings'}
      onClose={onClose}
      description={'Use this menu to set up a Transition for your FSM'}
      disclaimers={TRANSITION_SETTINGS_DISCLAIMERS}>
      <></>
    </SettingsDialog>
  );
}

export default TransitionSettingsDialog;
