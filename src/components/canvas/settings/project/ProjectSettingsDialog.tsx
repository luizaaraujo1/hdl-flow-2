import SettingsDialog from '@components/shared/SettingsDialog';
import useStoreDialog from '@store/useStoreDialog';

import ProjectSettings from './ProjectSettings';

function ProjectSettingsDialog() {
  const {projectSettingsOpen, setProjectSettingsOpen} = useStoreDialog();
  return (
    <SettingsDialog
      open={projectSettingsOpen}
      setOpen={setProjectSettingsOpen}
      title={'Project Settings'}
      description={'Use this menu to set up your project'}>
      <ProjectSettings />
    </SettingsDialog>
  );
}

export default ProjectSettingsDialog;
