import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import App from './App.tsx';
import './global.css';
import Canvas from './routes/Canvas.tsx';
import Home from './routes/Home.tsx';
import NotFound from './routes/NotFound.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {path: '/', element: <Home />},
      {path: '/canvas', element: <Canvas />},
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
