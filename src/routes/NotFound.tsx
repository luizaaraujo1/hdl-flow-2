import {Link} from 'react-router-dom';

function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <h1 className="section-title">Page not found!</h1>
      <h2 className="text-lg font-light mb-8">Error 404</h2>
      <Link to="/" className="btn-primary">
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
