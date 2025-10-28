import { Navigate } from "react-router-dom";

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // redirect to login
  }
  return children; // show the page if logged in
}

export default ProtectedRoute;
