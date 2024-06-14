import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center h-100">
      <h1>404</h1>
      <h3>Page Not Found</h3>
      <Link to="/dashboard" className="btn btn-primary">Go Back</Link>
    </div>
  );
};

export default NotFoundPage;
