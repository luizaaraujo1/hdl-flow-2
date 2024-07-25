import CodeResultDialog from './code/CodeResultDialog';
import HowToUseDialog from './howToUse/HowToUseDialog';
import PortSettingsDialog from './port/PortSettingsDialog';
import ProjectSettingsDialog from './project/ProjectSettingsDialog';
import StateSettingsDialog from './state/StateSettingsDialog';
import TransitionSettingsDialog from './transition/TransitionSettingsDialog';

function Dialogs() {
  return (
    <>
      <PortSettingsDialog />
      <StateSettingsDialog />
      <TransitionSettingsDialog />
      <CodeResultDialog />
      <ProjectSettingsDialog />
      <HowToUseDialog />
    </>
  );
}

export default Dialogs;
