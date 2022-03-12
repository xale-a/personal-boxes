import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from '../utils/firebase';
import { BoxFront } from '../types';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

const ProfileDashboard: NextPage = () => {
  const [boxes, setBoxes] = useState<BoxFront[]>();
  const { currentUser } = useAuth();
  const router = useRouter();

  const getBoxes = async () => {
    try {
      let boxes = [];

      const boxesSnapshot = await getDocs(
        query(
          collection(db, 'boxes'),
          where('uid', '==', currentUser?.uid),
          orderBy('createdAt', 'desc')
        )
      );

      for (let box of boxesSnapshot.docs) {
        boxes.push({
          boxid: box.id,
          ownerid: box.data().uid,
          createdAt: box.data().createdAt,
          frontURL: box.data().frontURL,
          unlocked: box.data().unlocked,
        } as BoxFront);
      }

      setBoxes([...boxes]);
    } catch (error) {
      // Error
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }

    getBoxes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
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

export default ProfileDashboard;

const BoxFrontLink = styled.div`
  max-width: 32rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Boxes = styled.div`
  padding: 0.5rem;
`;
