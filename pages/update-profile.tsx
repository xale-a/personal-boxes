import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import UpdateProfileForm from '../components/update-profile-form';
import { useAuth } from '../contexts/auth';

const UpdateProfile: NextPage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser == null) {
      router.push('/login');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      <UpdateProfileForm />
    </div>
  );
};

export default UpdateProfile;
