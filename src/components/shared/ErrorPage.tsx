import {Link} from 'react-router-dom';

interface ErrorPageProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
}

function ErrorPage({title, subtitle, buttonText}: ErrorPageProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white px-10 text-center">
      <h1 className="section-title">{title}</h1>
      {subtitle && <h2 className="mb-8 text-lg font-light">{subtitle}</h2>}
      {buttonText && (
        <Link to="/" className="btn-primary">
          {buttonText}
        </Link>
      )}
    </div>
  );
}

export default ErrorPage;
