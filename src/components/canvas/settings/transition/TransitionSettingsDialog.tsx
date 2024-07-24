import SettingsDialog from '@shared/SettingsDialog';
import useStoreDialog from '@store/useStoreDialog';

import TransitionEditor from './TransitionEditor';

function TransitionSettingsDialog() {
  const {
    transitionSettingsOpen,
    setTransitionSettingsOpen,
    setSelectedTransitionId,
  } = useStoreDialog();

  const TRANSITION_SETTINGS_DISCLAIMERS = [
    'Warning! If you change your Ports you will lose these changes',
  ];

  const onClose = () => setSelectedTransitionId(undefined);

  return (
    <SettingsDialog
      open={transitionSettingsOpen}
      setOpen={setTransitionSettingsOpen}
      title={'Transition Settings'}
      onClose={onClose}
      description={'Use this menu to set up a Transition for your FSM'}
      disclaimers={TRANSITION_SETTINGS_DISCLAIMERS}>
      <TransitionEditor />
    </SettingsDialog>
  );
}

export default TransitionSettingsDialog;
