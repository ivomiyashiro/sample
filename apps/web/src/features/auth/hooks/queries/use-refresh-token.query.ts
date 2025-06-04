import { useQuery } from '@tanstack/react-query';

import { AUTH_KEY } from '@/features/auth/hooks';
import { refreshTokenApi } from '@/features/auth/api';

export const useRefreshTokenQuery = () => {
  return useQuery({
    queryKey: [AUTH_KEY],
    queryFn: async () => {
      const result = await refreshTokenApi.handler();

      if (result.isFailure) {
        throw result.error;
      }

      refreshTokenApi.setAuthToken(result.value.data!.session.accessToken);

      return result.value.data!.user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 55, // 55 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });
};
