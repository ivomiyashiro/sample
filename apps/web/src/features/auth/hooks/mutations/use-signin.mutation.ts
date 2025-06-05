import type { ErrorResponse, SignInDTO, UserDTO } from '@sample/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { signinApi } from '@/features/auth/api';
import { AUTH_KEY } from '@/features/auth/hooks';

export const useSignInMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { state } = useLocation();

  return useMutation({
    mutationKey: [AUTH_KEY],
    mutationFn: async (data: SignInDTO) => {
      const result = await signinApi.handler(data);

      if (result.isFailure) {
        throw result.error;
      }

      signinApi.setAuthToken(result.value.data!.session.accessToken);

      return result.value.data!.user;
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.error.message);
    },
    onSuccess: (user: UserDTO) => {
      queryClient.setQueryData([AUTH_KEY], user);
      toast.success('Signed in successfully');

      if (state?.from) {
        navigate(state.from);
      } else {
        navigate('/');
      }
    },
  });
};
