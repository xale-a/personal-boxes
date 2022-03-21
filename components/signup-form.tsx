import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/auth';
import { default as NextLink } from 'next/link';
import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Link, Spacer } from '@chakra-ui/react';
import { FirebaseError } from 'firebase/app';

type FormData = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const SingUpForm = () => {
  const [isError, setIsError] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm<FormData>();
  const password = watch('password', '');

  const onSubmit = handleSubmit(async (data) => {
    setIsError(false);

    try {
      await signUp(data.email, data.password);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          return setError('email', { type: 'auth', message: 'Email already in use' });
        }
      }

      // Default error
      setIsError(true);
    }
  });

  return (
    <form method='post' onSubmit={onSubmit}>

      {isError && <Alert status='error'>Failed to create an account, please try again</Alert>}

      <FormControl mb={3} isInvalid={!!errors.email}>
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

      <FormControl mb='3' isInvalid={!!errors.password}>
        <FormLabel htmlFor='password'>Enter your password:</FormLabel>
        <Input
          id='password'
          type='password'
          {...register('password', {
            required: 'Please enter your password',
            minLength: {
              value: 8,
              message: 'You need to ented at least 8 characters',
            }
          })}
        />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb={7} isInvalid={!!errors.passwordConfirm}>
        <FormLabel htmlFor='passwordConfirm'>Confirm your password:</FormLabel>
        <Input
          id='passwordConfirm'
          type='password'
          {...register('passwordConfirm', {
            required: 'Please enter your password',
            validate: (value) => {
              return value === password || 'The passwords do not match';
            }
          })}
        />
        <FormErrorMessage>{errors.passwordConfirm?.message}</FormErrorMessage>
      </FormControl>

      <Flex alignItems={'center'}>
        <Box>
          <Box fontSize='sm'>
            Have an account?
          </Box>
          <NextLink href='/login' passHref>
            <Link>Sign In</Link>
          </NextLink>
        </Box>
        <Spacer />
        <Button type='submit' isLoading={isSubmitting} size='lg'>
          Create an account
        </Button>
      </Flex>

    </form>
  );
};

export default SingUpForm;
