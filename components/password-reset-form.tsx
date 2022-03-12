import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/auth';
import { Button } from './shared/buttons';
import { FormControl, Submit } from './shared/form';

type FormData = {
  email: string,
};

const PasswordResetForm = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { passwordReset } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setMessage('');
      setError('');
      await passwordReset(data.email);
      setMessage('Check your inbox for further instructions');
    } catch {
      setError('Failed to reset password, please try again');
    }
  });

  return (
    <form method="post" onSubmit={onSubmit}>
      {error && <div>{error}</div>}
      {message && <div>{message}</div>}
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
      <Submit>
        <Button type="submit" disabled={isSubmitting}>Reset Password</Button>
        <Link href="/login">Cancel</Link>
      </Submit>
    </form>
  );
};

export default PasswordResetForm;
