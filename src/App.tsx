import {Outlet} from 'react-router-dom';

import CodeResultDialog from '@components/canvas/settings/code/CodeResultDialog';
import PortSettingsDialog from '@components/canvas/settings/port/PortSettingsDialog';
import StateSettingsDialog from '@components/canvas/settings/state/StateSettingsDialog';
import TransitionSettingsDialog from '@components/canvas/settings/transition/TransitionSettingsDialog';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {SpeedInsights} from '@vercel/speed-insights/react';

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-800 font-roboto">
      <Outlet />
      <SpeedInsights />
      <PortSettingsDialog />
      <StateSettingsDialog />
      <TransitionSettingsDialog />
      <CodeResultDialog />
    </div>
  );
}

export default App;
