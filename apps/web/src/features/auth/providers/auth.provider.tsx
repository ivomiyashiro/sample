import { AppFallback } from '@/components/ui';
import { useRefreshTokenQuery } from '@/features/auth/hooks/queries';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useRefreshTokenQuery();

  return <>{isLoading ? <AppFallback /> : children}</>;
};
