import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from '../utils/firebase';
import { BoxFrontType } from '../types';
import { default as NextLink } from 'next/link';
import { Alert, Link } from '@chakra-ui/react';
import BoxFront from '../components/box-front';
import BoxesContainer from '../components/boxes-container';
import Head from 'next/head';

const ProfileDashboard: NextPage = () => {
  const [boxes, setBoxes] = useState<BoxFrontType[]>();
  const [isError, setIsError] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();

  const getBoxes = async () => {
    try {
      // Get user specific boxes
      const boxesSnapshot = await getDocs(
        query(
          collection(db, 'boxes'),
          where('ownerid', '==', currentUser?.uid),
          orderBy('createdAt', 'desc')
        )
      );

      // Set user specific boxes
      let boxes = [];

      for (let box of boxesSnapshot.docs) {
        boxes.push({
          ...box.data(),
          boxid: box.id,
        } as BoxFrontType);
      }

      setBoxes([...boxes]);
    } catch (error) {
      // Error
      console.log(error);
      setIsError(true);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }

    getBoxes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BoxesContainer>

      <Head>
        <title>My Boxes | Personal Boxes</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {isError && (
        <Alert status='error'>
          <div>
            Failed to get boxes, please <Link onClick={() => { router.reload(); }}>try again</Link>
          </div>
        </Alert>
      )}

      {boxes && boxes.map((box) => (
        <NextLink key={box.boxid} href={`box/${box.boxid}`} passHref>
          <BoxFront boxFront={box} />
        </NextLink>
      ))}

    </BoxesContainer>
  );
};

export default ProfileDashboard;
