import { collection, getDocs } from 'firebase/firestore';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BoxFront } from '../types';
import { db } from '../utils/firebase';

const Home: NextPage = () => {
  const [boxes, setBoxes] = useState<BoxFront[]>();

  const getBoxes = async () => {
    try {
      let boxes = [];
      // Get all boxes
      const boxesSnapshot = await getDocs(collection(db, 'boxes'));
      for (let box of boxesSnapshot.docs) {
        boxes.push({
          boxid: box.id,
          ownerid: box.data().uid,
          createdAt: box.data().createdAt,
          frontURL: box.data().frontURL,
          unlocked: box.data().unlocked,
        } as BoxFront);
      }
      // Set all boxes
      setBoxes([...boxes]);
    } catch (error) {
      // Error
      console.log(error);
    }
  };

  useEffect(() => {
    getBoxes();
  }, []);

  return (
    <div className="container">
      <Head>
        <title>Personal Boxes</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Boxes>
        {boxes && boxes.map((box) => (
          <Link key={box.boxid} href={`box/${box.boxid}`} passHref>
            <BoxFrontLink>
              <Image src={box.frontURL} width={1920} height={1080} alt="Front of a box" />
            </BoxFrontLink>
          </Link>
        ))}
      </Boxes>
    </div>
  );
};

export default Home;

const BoxFrontLink = styled.div`
  max-width: 32rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Boxes = styled.div`
  padding: 0.5rem;
`;
