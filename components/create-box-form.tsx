import { useForm } from 'react-hook-form';
import { Button } from './shared/buttons';
import { Submit } from './shared/form';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc, setDoc } from "firebase/firestore";
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
import randomstring from 'randomstring';

type FormData = {
  front: string;
};

const CreateBoxForm = () => {
  const [error, setError] = useState('');
  const [covers, setCovers] = useState<string[]>([]);
  const { currentUser } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    if (currentUser == null) {
      router.push('/login');
    }

    setError('');
    try {
      const box = await addDoc(collection(db, 'boxes'), {
        createdAt: serverTimestamp(),
        uid: currentUser?.uid,
        frontURL: data.front,
      });

      const key = randomstring.generate(20);

      await setDoc(doc(db, 'boxes', box.id, 'private', 'key'), {
        value: key,
      });

      await setDoc(doc(db, 'boxes', box.id, 'private', 'content'), {
        items: [],
      });

      router.push(`box/${box.id}/edit`);
    } catch (error) {
      console.log(error);
      setError('Failed to create box');
    }
  });

  const getBoxFronts = async () => {
    try {
      const boxFrontsSnap = await getDoc(doc(db, 'box-fronts', 'box-fronts-url'));

      if (!boxFrontsSnap.exists()) {
        throw Error('Database ref error');
      }

      setCovers(boxFrontsSnap.data().urls);
    } catch {
      console.log(error);
      setError('Server error');
    }
  };

  useEffect(() => {
    getBoxFronts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <form onSubmit={onSubmit}>
      <h2>Please pick box cover:</h2>
      {error && <div>{error}</div>}
      <BoxCoverPicker>
        {covers && covers.map((cover => (
          <BoxCover key={cover}>
            <Image src={cover} width={140} height={140} objectFit="cover" alt="Box cover" />
            <input type="radio" value={cover} {...register('front')} />
          </BoxCover>
        )))}
      </BoxCoverPicker>
      <Submit style={{ marginTop: '1rem' }}>
        <Link href="/profile-dashboard">Cancel</Link>
        <Button type="submit" disabled={isSubmitting}>Create box</Button>
      </Submit>
    </form>
  );
};

export default CreateBoxForm;

const BoxCoverPicker = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoxCover = styled.label`
  cursor: pointer;
`;
