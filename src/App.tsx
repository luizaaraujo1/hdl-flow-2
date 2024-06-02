import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {SpeedInsights} from '@vercel/speed-insights/react';
import {Outlet} from 'react-router-dom';

import {GlobalContextProvider} from './contexts/GlobalContext';

function App() {
  return (
    <GlobalContextProvider>
      <div className="flex min-h-screen flex-col bg-gray-800 font-roboto">
        <Outlet />
        <SpeedInsights />
      </div>
    </GlobalContextProvider>
  );
}

export default App;
