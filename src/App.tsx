import {Outlet} from 'react-router-dom';

import Dialogs from '@components/canvas/settings/Dialogs';
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
      <Dialogs />
    </div>
  );
}

export default App;
