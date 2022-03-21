import { doc, getDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BoxFrontType } from '../types';
import { db } from '../utils/firebase';
import { Alert, Box, Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import BoxFront from '../components/box-front';
import Head from 'next/head';

type FormData = {
  query: string;
};

const Search = () => {
  const [box, setBox] = useState<BoxFrontType>();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setError('');
    setBox(undefined);

    try {
      const boxSnap = await getDoc(doc(db, 'boxes', data.query));

      if (boxSnap.exists()) {
        setBox({
          boxid: boxSnap.id,
          ownerid: boxSnap.data().uid,
          createdAt: boxSnap.data().createdAt,
          frontURL: boxSnap.data().frontURL,
          unlocked: boxSnap.data().unlocked,
        } as BoxFrontType);
      } else {
        throw Error(`Box with a id of "${data.query}" doesn't exist.`);
      }
    } catch (error: any) {
      setError(error.message);
    }
  });

  return (
    <Box p='2'>

      <Head>
        <title>Find Box | Personal Boxes</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Box maxW={['xs', 'md']} mx='auto' mb='4' mt='2'>
        <form onSubmit={onSubmit}>
          <FormControl mb={3} isInvalid={!!errors.query}>
            <FormLabel htmlFor='query'>Enter box id:</FormLabel>
            <Input
              id='query'
              type='text'
              {...register('query', {
                required: 'Please enter box id',
              })}
            />
            <FormErrorMessage>{errors.query?.message}</FormErrorMessage>
          </FormControl>
          <Button type='submit' disabled={isSubmitting}>Search</Button>
        </form>
        {error && <Alert status='error' mt='3'>{error}</Alert>}
      </Box>

      {box && (
        <BoxFront boxFront={box} />
      )}

    </Box>
  );
};

export default Search;
