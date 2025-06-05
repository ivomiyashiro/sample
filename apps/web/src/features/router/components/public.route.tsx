import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/features/auth/hooks/others/use-auth.hook';

interface PublicRouteProps {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  redirectTo = '/',
  redirectIfAuthenticated = false,
}) => {
  const auth = useAuth();

  if (auth && redirectIfAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
