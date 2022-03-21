import { Alert, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Spacer } from '@chakra-ui/react';
import { FirebaseError } from 'firebase/app';
import { default as NextLink } from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/auth';

type FormData = {
  email: string,
};

const PasswordResetForm = () => {
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const { passwordReset } = useAuth();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setMessage('');
    setIsError(false);

    try {
      await passwordReset(data.email);
      setMessage('Check your inbox for further instructions');
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          return setError('email', { type: 'auth', message: 'Email not found' });
        }
      }

      // Default error
      setIsError(true);
    }
  });

  return (
    <form method='post' onSubmit={onSubmit}>

      {isError && <Alert status='error'>Failed to reset password, please try again</Alert>}
      {message && <Alert status='success'>{message}</Alert>}

      <FormControl mb='7' isInvalid={!!errors.email}>
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

      <Flex alignItems={'center'}>
        <NextLink href='/login' passHref>
          <Button type='button' variant='ghost' px='1' ml='-1'>
            Cancel
          </Button>
        </NextLink>
        <Spacer />
        <Button type='submit' isLoading={isSubmitting} size='lg'>Reset Password</Button>
      </Flex>

    </form>
  );
};

export default PasswordResetForm;
