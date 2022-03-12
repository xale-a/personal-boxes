import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth';
import { FormControl, Submit } from './shared/form';
import { Button } from './shared/buttons';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const SingUpForm = () => {
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>();
  const password = watch('password', '');

  const onSubmit = handleSubmit(async (data) => {
    setError('');
    try {
      await signUp(data.email, data.password);
      router.push('/');
    } catch {
      setError('Failed to create an account');
    }
  });

  return (
    <form method="post" onSubmit={onSubmit}>
      {error && error}
      <FormControl>
        <label htmlFor="email">Enter your email:</label>
        <input
          type="email"
          {...register('email', {
            required: 'Please enter your email',
          })}
        />
        <div>{errors.email?.message}</div>
      </FormControl>
      <FormControl>
        <label htmlFor="password">Enter your password:</label>
        <input
          type="password"
          {...register('password', {
            required: 'Please enter your password',
            minLength: {
              value: 8,
              message: 'You need to ented at least 8 characters',
            }
          })}
        />
        <div>{errors.password?.message}</div>
      </FormControl>
      <FormControl>
        <label htmlFor="passwordConfirm">Confirm your password:</label>
        <input
          type="password"
          {...register('passwordConfirm', {
            required: 'Please enter your password',
            validate: (value) => {
              return value === password || 'The passwords do not match';
            }
          })}
        />
        <div>{errors.passwordConfirm?.message}</div>
      </FormControl>
      <Submit>
        <Button type="submit" disabled={isSubmitting}>Sign Up</Button>
        <Link href="/login">Cancel</Link>
      </Submit>
    </form>
  );
};

export default SingUpForm;
