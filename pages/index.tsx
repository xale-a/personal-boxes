import { collection, getDocs } from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from 'next/head';
import { default as NextLink } from 'next/link';
import { useEffect, useState } from 'react';
import { BoxFrontType } from '../types';
import { db } from '../utils/firebase';
import BoxFront from '../components/box-front';
import { Alert, Link } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import BoxesContainer from '../components/boxes-container';

const Home: NextPage = () => {
  const [boxes, setBoxes] = useState<BoxFrontType[]>();
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const getBoxes = async () => {
    try {
      // Get all boxes
      const boxesSnapshot = await getDocs(collection(db, 'boxes'));

      // Set all boxes
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
    //TODO Listen for changes
    getBoxes();
  }, []);

  return (
    <BoxesContainer>

      <Head>
        <title>Personal Boxes</title>
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

export default Home;
