import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SignInDTO } from '@sample/shared';

import { PageLayout } from '@/components/layouts';
import { Button, Input, Label } from '@/components/ui';

import { signInSchema } from '../validations/signin.schema';
import { useSignInMutation } from '../hooks/mutations/use-signin.mutation';

const SignInPage = () => {
  const { mutate: signIn, isPending } = useSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInDTO>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (formData: SignInDTO) => {
    signIn(formData);
  };

  return (
    <PageLayout title="Sign In" description="Sign in to your account">
      <form
        className="flex flex-col gap-4 w-full max-w-sm p-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="Type your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Type your password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </PageLayout>
  );
};

export default SignInPage;
