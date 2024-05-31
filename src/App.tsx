import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {SpeedInsights} from '@vercel/speed-insights/react';
import {Outlet} from 'react-router-dom';

import Footer from './components/shared/Footer';
import Header from './components/shared/Header';
import {GlobalContextProvider} from './contexts/GlobalContext';

function App() {
  return (
    <GlobalContextProvider>
      <div className="min-h-screen flex flex-col font-roboto bg-gray-800">
        <Header />
        <Outlet />
        <Footer />
        <SpeedInsights />
      </div>
    </GlobalContextProvider>
  );
}

export default App;
