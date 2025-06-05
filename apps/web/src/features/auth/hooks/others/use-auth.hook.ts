import type { UserDTO } from '@sample/shared';
import { useQueryClient } from '@tanstack/react-query';

import { AUTH_KEY } from '@/features/auth/hooks';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const auth = queryClient.getQueryData<UserDTO>([AUTH_KEY]);

  if (!auth) {
    return null;
  }

  return auth;
};
