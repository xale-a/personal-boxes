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
    <div className="container">
      <CreateBoxForm />
    </div>
  );
};

export default CreateBox;
