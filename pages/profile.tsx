import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/auth';

const Profile: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, logOut } = useAuth();
  const router = useRouter();

  const signOut = async () => {
    setLoading(true);
    setError('');

    try {
      await logOut();
      router.push('/');
    } catch (error) {
      setError('Failed to sign out, please try again');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      <StyledProfile>
        <MainInfo>
          <ProfilePicture>P</ProfilePicture>
          <Email>{currentUser?.email}</Email>
        </MainInfo>
        <Link href="/update-profile"><a>Update profile</a></Link>
        <Link href="/profile"><a style={{ textDecoration: 'line-through red' }}>Advanced functions</a></Link>
        <Button onClick={signOut} disabled={loading}>Sign Out</Button>
        {error && <Error>{error}</Error>}
      </StyledProfile>
    </div>
  );
};

export default Profile;

const StyledProfile = styled.div`
  font-size: 1.15rem;

  a {
    display: block;
    margin-bottom: 0.5rem;
  }
`;
const MainInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
`;
const Button = styled.button`
  display: block;
  margin-top: 2rem;
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
`;
const Email = styled.div`
  font-size: 1.25rem;
`;
const ProfilePicture = styled.div`
  border: 1px solid gray;
  border-radius: 50%;
  width: 6.25rem;
  height: 6.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const Error = styled.div`
  color: red;
  font-size: 0.95rem;
`;