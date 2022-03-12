import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuth } from '../contexts/auth';
import { useForm } from 'react-hook-form';
import { FormControl, Submit } from './shared/form';
import { Button } from './shared/buttons';

type FormData = {
  email: string,
  password: string,
};

const LogInForm = () => {
  const [error, setError] = useState('');
  const { logIn } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await logIn(data.email, data.password);
      router.push('/');
    } catch {
      setError('Failed to log in, please try again');
    }
  });

  return (
    <form method="post" onSubmit={onSubmit}>
      {error && <div>{error}</div>}
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
          {...register("password", {
            required: 'Please enter your password',
          })}
        />
        <div>{errors.password?.message}</div>
      </FormControl>
      <Link href="/password-reset" passHref><ABlock>Forgot Password?</ABlock></Link>
      <Submit>
        <Button type="submit" disabled={isSubmitting}>Sign In</Button>
        <Link href="/signup"><a>Create an accout</a></Link>
      </Submit>
    </form>
  );
};

export default LogInForm;

const ABlock = styled.a`
  display: block;
  margin-bottom: 1rem;
  cursor: pointer;
`;
