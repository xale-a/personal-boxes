import { useState } from 'react';
import { useAuth } from '../contexts/auth';
import { updateEmail, updatePassword } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { FormControl, Submit } from './shared/form';
import { Button } from './shared/buttons';
import Link from 'next/link';

type FormData = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const UpdateProfileForm = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      email: currentUser?.email || ''
    }
  });
  const password = watch('password', '');

  const onSubmit = handleSubmit(async (data) => {
    if (currentUser) {
      try {
        setError('');
        setMessage('');
        if ((data.email !== currentUser.email) && (data.email !== '')) {
          await updateEmail(currentUser, data.email);
        }
        if (data.password !== '') {
          await updatePassword(currentUser, data.password);
        }
        setMessage('Profile succesfully updated');
      } catch {
        setError('Failed to update profile');
      }
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
          {...register('email')}
        />
        <div>{errors.email?.message}</div>
      </FormControl>
      <FormControl>
        <label htmlFor="password">Enter your password:</label>
        <input
          type="password"
          {...register('password', {
            minLength: {
              value: 8,
              message: 'You need to ented at least 8 characters',
            }
          })}
          placeholder="Leave blank to keep the same"
        />
        <div>{errors.password?.message}</div>
      </FormControl>
      <FormControl>
        <label htmlFor="password-confirm">Confirm your password:</label>
        <input
          type="password"
          {...register('passwordConfirm', {
            validate: (value) => {
              return value === password || 'The passwords do not match';
            }
          })}
          placeholder="Leave blank to keep the same"
        />
        <div>{errors.passwordConfirm?.message}</div>
      </FormControl>
      <Submit>
        <Button type="submit" disabled={isSubmitting}>Update</Button>
        <Link href="/profile">Cancel</Link>
      </Submit>
    </form>
  );
};

export default UpdateProfileForm;
