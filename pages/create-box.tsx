import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import CreateBoxForm from '../components/create-box-form';
import { useAuth } from '../contexts/auth';

const CreateBox: NextPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box p='5'>
      <CreateBoxForm />
    </Box>
  );
};

export default CreateBox;
