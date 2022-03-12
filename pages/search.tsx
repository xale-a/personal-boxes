import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/shared/buttons';
import { FormControl } from '../components/shared/form';
import { BoxFront } from '../types';
import { db } from '../utils/firebase';
import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';

type FormData = {
  query: string;
};

const Search = () => {
  const [box, setBox] = useState<BoxFront>();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setError('');
    try {
      const boxSnap = await getDoc(doc(db, 'boxes', data.query));

      if (boxSnap.exists()) {
        setBox({
          boxid: boxSnap.id,
          ownerid: boxSnap.data().uid,
          createdAt: boxSnap.data().createdAt,
          frontURL: boxSnap.data().frontURL,
          unlocked: boxSnap.data().unlocked,
        } as BoxFront);
      } else {
        throw Error('Box not found');
      }
    } catch (error: any) {
      setError(error.message);
    }
  });

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <FormControl>
          <label htmlFor="query">Enter box id:</label>
          <input
            type="text"
            {...register('query')}
          />
          <div>{errors.query?.message}</div>
        </FormControl>
        <Button type="submit" disabled={isSubmitting}>Search</Button>
      </form>
      {error && <div>{error}</div>}
      {box && <Link href={`box/${box.boxid}`} passHref>
        <BoxFrontLink>
          <Image src={box.frontURL} width={1920} height={1080} alt="Front of a box" />
        </BoxFrontLink>
      </Link>}
    </div>
  );
};

export default Search;

const BoxFrontLink = styled.div`
  max-width: 32rem;
  cursor: pointer;
  margin: 1rem 0.5rem 0;
`;
