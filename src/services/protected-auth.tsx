// src/components/ProtectedRoute.tsx
import { RootState } from "@/context/store/rootReducer";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(isAuthenticated);
  
  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/auth/signin" />;
  }

  return children;
};

export default ProtectedRoute;
