import {Outlet} from 'react-router-dom';

function App() {
  return (
    <div className="w-screen h-screen">
      <p>Navbar</p>
      <h1>React router</h1>
      <Outlet />
      <p>Footer</p>
    </div>
  );
}

export default App;
