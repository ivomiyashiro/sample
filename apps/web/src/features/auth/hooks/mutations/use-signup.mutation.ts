import type { SignUpDTO } from '@sample/shared';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { signUpApi } from '@/features/auth/api';
import { AUTH_KEY } from '@/features/auth/hooks';

export const useSignUpMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationKey: [AUTH_KEY],
    mutationFn: async (data: SignUpDTO) => {
      const result = await signUpApi.handler(data);

      if (result.isFailure) {
        throw result.error;
      }

      return result.value;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success('Signed up successfully');
      navigate('/signin');
    },
  });
};
