import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Alert, Box, Button, Center, Flex, Input, Link, useRadio, useRadioGroup, UseRadioProps } from '@chakra-ui/react';
import { arrayRemove, arrayUnion, collection, doc, documentId, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';
import { db, storage } from '../utils/firebase';

type BoxCoverPickerProps = {
  onChange: (...event: any[]) => void;
  value: string;
  name: string;
};

const BoxFrontCover = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props as UseRadioProps);
  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as='label'>
      <input {...input} />
      <Flex
        {...checkbox}
        cursor='pointer'
        maxW={props.maxW}
        _checked={{
          outline: '3px solid',
          outlineOffset: '1px',
          outlineColor: 'blue.500'
        }}
      // _focus={{
      //   boxShadow: 'outline',
      // }}
      >
        {props.children}
      </Flex>
    </Box>
  );
};

const BoxFrontCoverEdit = (props: any) => {
  return (
    <Flex
      onClick={() => { props.deleteCover(props.cover); }}
      maxW={props.maxW}
      position='relative'
      cursor='pointer'
    >
      {props.children}
      <Center
        position='absolute'
        top='0'
        left='0'
        right='0'
        bottom='0'
        bg='rgba(0, 0, 0, 0.5)'
      >
        <DeleteIcon color='white' w='5' h='5' />
      </Center>
    </Flex>
  );
};

const BoxCoverPicker = ({ onChange, value, name }: BoxCoverPickerProps) => {
  const [isError, setIsError] = useState(false);
  const [editCoversError, setEditCoversError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [defaultCovers, setDefaultCovers] = useState<string[]>();
  const [userCovers, setUserCovers] = useState<string[]>();
  const { currentUser } = useAuth();
  const router = useRouter();
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    onChange: onChange,
    value: value,
  });

  const group = getRootProps();

  const getBoxCovers = async () => {
    setIsError(false);

    try {
      const boxFrontsSnap = await getDocs(query(
        collection(db, 'box-front-covers'),
        where(documentId(), 'in', ['default', currentUser?.uid])
      ));

      if (boxFrontsSnap.empty) {
        throw Error('Database ref error');
      }

      boxFrontsSnap.docs.forEach((doc) => {
        if (doc.id === 'default') {
          return setDefaultCovers(doc.data().urls);
        }
        if (doc.id === currentUser?.uid) {
          return setUserCovers(doc.data().urls);
        }
      });
    } catch (error) {
      console.log(error);
      setIsError(true);
    }
  };

  const uploadCover = async (e: any) => {
    setIsUploading(true);
    setEditCoversError('');

    try {
      let fileName = e.target.files[0].name as string;

      if (userCovers) {
        if (userCovers.length > 10) {
          throw Error('Maximum number of covers is 10');
        }

        const userCoverNames = userCovers.map((userCover) => (
          ref(storage, userCover).name
        ));

        let increment = 1;
        while (userCoverNames.includes(fileName)) {
          const nameSplit = fileName.split('.');
          nameSplit[nameSplit.length - 2] += ` (${increment})`;
          fileName = nameSplit.join('.');
          increment++;
        }
      }

      // Uploading logic
      const fileRef = ref(storage, `box-front-covers/${currentUser?.uid}/${fileName}`);

      await uploadBytes(fileRef, e.target.files[0]);
      const url = await getDownloadURL(fileRef);

      const userFrontRef = doc(db, 'box-front-covers', currentUser?.uid as string);
      await setDoc(userFrontRef, {
        urls: arrayUnion(url),
      }, { merge: true });

      getBoxCovers();
    } catch (error: any) {
      // Error logic
      console.log(error);
      setEditCoversError(error.message);
    }
    console.log('here');
    setIsUploading(false);
  };

  const deleteCover = async (cover: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    setEditCoversError('');

    try {
      await deleteObject(ref(storage, cover));
      await updateDoc(doc(db, 'box-front-covers', currentUser?.uid as string), {
        urls: arrayRemove(cover)
      });

      getBoxCovers();
    } catch (error: any) {
      console.log(error);
      setEditCoversError(error.message);
    }

    setIsDeleting(false);
  };

  useEffect(() => {
    if (currentUser == null) {
      router.push('/login');
    }

    getBoxCovers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex
      {...group}
      flexWrap='wrap'
      gap='2'
    >

      {isError && (
        <Alert status='error'>
          <div>
            Failed to get box covers, please <Link onClick={getBoxCovers}>try again</Link>
          </div>
        </Alert>
      )}

      {/* Toggle between pick and edit */}
      <Button
        w='3.5rem'
        h='3.5rem'
        onClick={() => setIsEdit((prevValue) => (!prevValue))}
      >
        {isEdit ? <>Done</> : <AddIcon />}
      </Button>
      {isEdit ? <>

        {/* Edit user covers */}
        {editCoversError && <Alert status='error'>{editCoversError}</Alert>}

        {userCovers && userCovers.map((cover => {
          return (
            <BoxFrontCoverEdit
              key={cover}
              cover={cover}
              deleteCover={deleteCover}
              maxW='3.5rem'
            >
              <Image src={cover} width={140} height={140} objectFit="cover" alt="Box cover" />
            </BoxFrontCoverEdit>
          );
        }))}

        <Box
          as='label'
          cursor='pointer'
        >
          <Input
            type='file'
            opacity='0'
            position='absolute'
            left='-9999px'
            onChange={uploadCover}
            disabled={isUploading}
          />
          <Button
            as='div'
            w='3.5rem'
            h='3.5rem'
            disabled={isUploading}
          >
            <AddIcon />
          </Button>
        </Box>

      </> : <>

        {/* Pick Cover */}
        {userCovers && userCovers.map((cover => {
          const radio = getRadioProps({ value: cover });

          return (
            <BoxFrontCover key={cover} {...radio} maxW='3.5rem'>
              <Image src={cover} width={140} height={140} objectFit="cover" alt="Box cover" />
            </BoxFrontCover>
          );
        }))}

        {defaultCovers && defaultCovers.map((cover => {
          const radio = getRadioProps({ value: cover });

          return (
            <BoxFrontCover key={cover} {...radio} maxW='3.5rem'>
              <Image src={cover} width={140} height={140} objectFit="cover" alt="Box cover" />
            </BoxFrontCover>
          );
        }
        ))}

      </>}

    </Flex >
  );
};

export default BoxCoverPicker;
