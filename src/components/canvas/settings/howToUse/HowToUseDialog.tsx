import SettingsDialog from '@shared/SettingsDialog';
import useStoreDialog from '@store/useStoreDialog';

import HowToUse from './HowToUse';

function HowToUseDialog() {
  const {howToUseOpen, setHowToUseOpen} = useStoreDialog();

  return (
    <SettingsDialog
      open={howToUseOpen}
      setOpen={setHowToUseOpen}
      title={'How to Use'}
      description={'Here you can learn about HDL Flow'}>
      <HowToUse />
    </SettingsDialog>
  );
}

export default HowToUseDialog;
