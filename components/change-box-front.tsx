import { useForm } from 'react-hook-form';
import { Button } from './shared/buttons';
import { Submit } from './shared/form';
import { db } from '../utils/firebase';
import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';

type FormData = {
  front: string;
};

type Props = {
  changeFront: (frontUrl: string) => void;
};

const ChangeBoxFrontForm = ({ changeFront }: Props) => {
  const [error, setError] = useState('');
  const [covers, setCovers] = useState<string[]>([]);
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    changeFront(data.front);
  });

  const getBoxFronts = async () => {
    try {
      const boxFrontsSnap = await getDoc(doc(db, 'box-fronts', 'box-fronts-url'));

      if (!boxFrontsSnap.exists()) {
        throw Error('Database ref error');
      }

      setCovers(boxFrontsSnap.data().urls);
    } catch (error: any) {
      setError(error.message || 'Server error');
    }
  };

  useEffect(() => {
    getBoxFronts();
  }, []);

  return (
    <form onSubmit={onSubmit}>
      <h2>Please pick new box cover:</h2>
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
        <Button type="submit" disabled={isSubmitting}>Change</Button>
      </Submit>
    </form>
  );
};

export default ChangeBoxFrontForm;

const BoxCoverPicker = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BoxCover = styled.label`
  cursor: pointer;
`;
