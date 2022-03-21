import { useState } from 'react';
import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth';
import { useForm } from 'react-hook-form';
import { Alert, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Link, Spacer } from '@chakra-ui/react';
import { FirebaseError } from 'firebase/app';

type FormData = {
  email: string,
  password: string,
};

const LogInForm = () => {
  const [isError, setIsError] = useState(false);
  const { logIn } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setIsError(false);

    try {
      await logIn(data.email, data.password);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        if (error.code === 'auth/user-not-found') {
          return setError('email', { type: 'auth', message: 'Email not found' });
        }

        if (error.code === 'auth/wrong-password') {
          return setError('password', { type: 'auth', message: 'Wrong password' });
        }
      }

      // Default error
      setIsError(true);
    }
  });

  return (
    <form method='post' onSubmit={onSubmit}>

      {isError && <Alert status='error'>Failed to sign in, please try again</Alert>}

      <FormControl mb='3' isInvalid={!!errors.email}>
        <FormLabel htmlFor='email'>Enter your email:</FormLabel>
        <Input
          id='email'
          type='email'
          {...register('email', {
            required: 'Please enter your email',
          })}
        />
        <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb='7' isInvalid={!!errors.password}>
        <FormLabel htmlFor='password'>Enter your password:</FormLabel>
        <Input
          id='password'
          type='password'
          {...register('password', {
            required: 'Please enter your password',
          })}
        />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        <NextLink href='/password-reset' passHref>
          <Link>Forgot Password?</Link>
        </NextLink>
      </FormControl>

      <Flex alignItems={'center'}>
        <NextLink href='/signup' passHref>
          <Button type='button' variant='ghost' px={1} ml={-1}>
            Create an account
          </Button>
        </NextLink>
        <Spacer />
        <Button type='submit' isLoading={isSubmitting} size='lg'>Sign In</Button>
      </Flex>

    </form>
  );
};

export default LogInForm;
