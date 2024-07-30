import {useLocation} from 'react-router-dom';

import ROUTE_PATHS from '@constants/routePaths';

import CodeResultDialog from './code/CodeResultDialog';
import HowToUseDialog from './howToUse/HowToUseDialog';
import PortSettingsDialog from './port/PortSettingsDialog';
import ProjectSettingsDialog from './project/ProjectSettingsDialog';
import StateSettingsDialog from './state/StateSettingsDialog';
import TransitionSettingsDialog from './transition/TransitionSettingsDialog';

function Dialogs() {
  const {pathname} = useLocation();

  const isOnCanvasPage = pathname === ROUTE_PATHS.Canvas;

  return (
    <>
      {isOnCanvasPage && (
        <>
          <PortSettingsDialog />
          <StateSettingsDialog />
          <TransitionSettingsDialog />
          <CodeResultDialog />
          <ProjectSettingsDialog />
          <HowToUseDialog />
        </>
      )}
    </>
  );
}

export default Dialogs;
