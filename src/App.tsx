import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Outlet} from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen flex flex-col font-roboto bg-gray-800">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
