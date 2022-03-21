import { Alert, Box, Flex, Link, Spinner } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';

const LogOut: NextPage = () => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, logOut } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      await logOut();
      router.push('/');
    } catch (error) {
      setIsError(true);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }

    signOut();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      minH='100%'
      maxW={['xs', 'md']}
      mx='auto'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      gap='2rem'
    >

      <Head>
        <title>Sign Out | Personal Boxes</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {isError && (
        <Alert status='error' display='block'>
          <div>
            Failed to sign out, please <Link onClick={() => { router.reload(); }}>try again</Link>
          </div>
        </Alert>
      )}

      {isLoading && (
        <Box>
          <Spinner mr='3' />
          Signing out
        </Box>
      )}

    </Flex>
  );
};

export default LogOut;
