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
      <div className="min-h-screen flex flex-col font-roboto bg-gray-800">
        <Outlet />
        <SpeedInsights />
      </div>
    </GlobalContextProvider>
  );
}

export default App;
