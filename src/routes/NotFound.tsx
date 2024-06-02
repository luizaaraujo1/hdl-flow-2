import {Link} from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="section-title">Page not found!</h1>
      <h2 className="mb-8 text-lg font-light">Error 404</h2>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
