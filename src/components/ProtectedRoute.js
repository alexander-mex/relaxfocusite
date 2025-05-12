import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAllowed }) => {
  if (!isAllowed) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;