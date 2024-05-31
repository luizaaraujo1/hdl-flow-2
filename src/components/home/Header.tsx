import {Link} from 'react-router-dom';

import {GITHUB_LINK} from '../../constants/links';
import ROUTE_PATHS from '../../constants/routePaths';

function Header() {
  return (
    <header className="bg-gray-800 text-gray-100 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">
          <Link to={ROUTE_PATHS.Home}>HDL Flow</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href={GITHUB_LINK} className="hover:text-gray-200">
                Feedback
              </a>
            </li>
            <li>
              <a href={GITHUB_LINK} className="hover:text-gray-200">
                Contribute
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
