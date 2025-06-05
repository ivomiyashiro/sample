import { Navigate, Outlet, useLocation } from 'react-router';

import { AppFallback } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks/others/use-auth.hook';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectTo = '/signin',
}) => {
  const auth = useAuth();
  const { pathname } = useLocation();

  if (auth === undefined) {
    return <AppFallback />;
  }

  if (!auth) {
    return <Navigate to={redirectTo} state={{ from: pathname }} replace />;
  }

  return <Outlet />;
};
