import { zodResolver } from '@hookform/resolvers/zod';
import type { SignUpDTO } from '@sample/shared';
import { useForm } from 'react-hook-form';

import { useSignUpMutation } from '../hooks/mutations/use-signup.mutation';
import { signUpSchema } from '../validations/signup.schema';

import { PageLayout } from '@/components/layouts';
import { Button, Input, Label } from '@/components/ui';

const SignUpPage = () => {
  const { mutate: signUp, isPending } = useSignUpMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDTO>({
    defaultValues: { email: '', password: '' },
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (formData: SignUpDTO) => {
    signUp(formData);
  };

  return (
    <PageLayout title="Sign Up" description="Sign up to your account">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-sm p-4"
      >
        <div className="flex flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" placeholder="Email" {...register('email')} />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </PageLayout>
  );
};

export default SignUpPage;
