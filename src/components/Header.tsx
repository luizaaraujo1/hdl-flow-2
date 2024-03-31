import {Link} from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-gray-100 shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">
          <Link to="/">HDL Flow</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/feedback" className="hover:text-gray-200">
                Feedback
              </Link>
            </li>
            <li>
              <a href="#contribute" className="hover:text-gray-200">
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
