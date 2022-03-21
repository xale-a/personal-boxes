import { Controller, useForm } from 'react-hook-form';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { default as NextLink } from 'next/link';
import randomstring from 'randomstring';
import { Alert, AspectRatio, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Spacer } from '@chakra-ui/react';
import BoxCoverPicker from './box-cover-picker';
import { getBytes, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../utils/firebase';

type FormData = {
  front: string;
};

type ErrorType = 'submit' | 'get' | undefined;

const CreateBoxForm = () => {
  const [error, setError] = useState<ErrorType>();
  const { currentUser } = useAuth();
  const router = useRouter();
  const { watch, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();

  const watchPick = watch('front');

  useEffect(() => {
    console.log(watchPick);
  }, [watchPick]);

  const onSubmit = handleSubmit(async (data) => {
    setError(undefined);

    try {
      const defaultFrontsSnap = await getDoc(doc(db, 'box-front-covers', 'default'));

      const box = await addDoc(collection(db, 'boxes'), {
        ownerid: currentUser?.uid,
        frontURL: data.front,
        unlocked: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // If there's custom front
      if (!defaultFrontsSnap.data()?.urls.includes(data.front)) {
        const userFrontRef = ref(storage, data.front);
        const boxFrontImage = await getBytes(ref(storage, userFrontRef.fullPath));

        await uploadBytes(ref(storage, `boxes/${currentUser?.uid}/${box.id}/cover/${userFrontRef.name}`), boxFrontImage);
      }

      const key = randomstring.generate(20);

      await setDoc(doc(db, 'boxes', box.id, 'private', 'key'), {
        value: key,
      });

      await setDoc(doc(db, 'boxes', box.id, 'private', 'content'), {
        items: [],
      });

      // router.push(`box/${box.id}/edit`);
      router.push(`profile-dashboard/`);
    } catch (error) {
      console.log(error);
      setError('submit');
    }
  });

  useEffect(() => {
    if (currentUser == null) {
      router.push('/login');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      as='form'
      onSubmit={onSubmit}
      maxW={['sm', 'md']}
      mx='auto'
    >
      {error === 'submit' && (
        <Alert status='error'>
          Failed to create box, please try again
        </Alert>
      )}

      <FormControl isInvalid={!!errors.front} mb='3'>
        <FormLabel>Pick your box cover:</FormLabel>
        <Controller
          control={control}
          name='front'
          rules={{ required: 'Please pick your box front', }}
          render={({ field: { onChange, value, name } }) => (
            <BoxCoverPicker
              onChange={onChange}
              value={value}
              name={name}
            />
          )}
        />
        <FormErrorMessage>{errors.front?.message}</FormErrorMessage>
      </FormControl>

      <AspectRatio
        maxW={['sm', 'md']}
        mx='auto'
        mb='6'
        ratio={16 / 9}
      >
        <Flex>
          {watchPick && (
            <Image src={watchPick} width={1920} height={1080} alt='Box front cover' />
          )}
        </Flex>
      </AspectRatio>

      <Flex alignItems={'center'}>
        <NextLink href='/profile-dashboard' passHref>
          <Button type='button' variant='ghost' px={1} ml={-1}>
            Cancel
          </Button>
        </NextLink>
        <Spacer />
        <Button type='submit' isLoading={isSubmitting} size='lg'>Create box</Button>
      </Flex>

    </Box>
  );
};

export default CreateBoxForm;
