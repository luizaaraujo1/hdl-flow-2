import ErrorPage from '../components/shared/ErrorPage';

function NotFound() {
  return (
    <ErrorPage
      title="Page not found!"
      subtitle="Error 404"
      buttonText="Go Home"
    />
  );
}

export default NotFound;
