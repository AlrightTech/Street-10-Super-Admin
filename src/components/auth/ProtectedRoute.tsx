import { Navigate } from 'react-router-dom';
import { authApiService } from '../../services/auth.api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route component that ensures user is authenticated and is an admin
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = authApiService.isAuthenticated();
  const isSuperAdmin = authApiService.isSuperAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isSuperAdmin) {
    // User is authenticated but not a super-admin
    authApiService.logout();
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

