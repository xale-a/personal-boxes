import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import AddFilesForm from '../../../components/add-files-form';
import { Button } from '../../../components/shared/buttons';
import { FormControl, Submit } from '../../../components/shared/form';
import { useAuth } from '../../../contexts/auth';
import type { Box, BoxContent, BoxFront } from '../../../types';
import Modal from 'react-modal';
import { db, storage } from '../../../utils/firebase';
import ChangeBoxFrontForm from '../../../components/change-box-front';

Modal.setAppElement("#__next");

type FormData = {
  key: string;
  unlocked: boolean;
};

const EditBox: NextPage = () => {
  const [box, setBox] = useState<Box>();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const router = useRouter();
  const { boxid } = router.query;
  const { currentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = useForm<FormData>();


  const boxFrontRef = doc(db, 'boxes', boxid as string);
  const boxContentRef = doc(db, 'boxes', boxid as string, 'private', 'content');
  const boxKeyRef = doc(db, 'boxes', boxid as string, 'private', 'key');

  const getBox = async () => {
    const boxFrontSnap = await getDoc(boxFrontRef);
    const boxContentSnap = await getDoc(boxContentRef);
    const boxKeySnap = await getDoc(boxKeyRef);

    if (!boxFrontSnap.exists() || !boxContentSnap.exists() || !boxKeySnap.exists()) {
      throw Error('Internal server error (getBox)');
    }

    const boxFront = {
      boxid: boxFrontSnap.id,
      ownerid: boxFrontSnap.data().id,
      createdAt: boxFrontSnap.data().createdAt,
      frontURL: boxFrontSnap.data().frontURL,
      unlocked: boxFrontSnap.data().unlocked,
    };

    setBox({
      ...boxFront as BoxFront,
      ...boxContentSnap.data() as BoxContent,
      key: boxKeySnap.data().value
    });
  };

  const check = async () => {
    setError('');
    try {
      // Checks
      const boxFrontSnap = await getDoc(boxFrontRef);
      if (!boxFrontSnap.exists()) {
        router.push('/create-box');
        throw Error('Box doesn\'t exist');
      }
      if (!currentUser) {
        router.push('/login');
        throw Error('Not logged in');
      }
      if (currentUser.uid !== boxFrontSnap.data().uid) {
        router.push(`/box/${boxid}`);
        throw Error('Access denied');
      }

      // If all checks are pass get box content
      await getBox();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addFiles = async (files: FileList) => {
    setError('');
    try {
      if (!currentUser || !box) {
        router.push('/login');
        throw Error('');
      }

      // Check to see if filesize fits in a box
      let size = box.items.reduce((prev, curr) => prev + curr.size, 0);
      for (let i = 0; i < files.length; i++) {
        size += files[i].size;
      }
      if (size > 125000000) {
        throw Error('Box capacity is 125MB');
      }

      // Check to see if number of items fit in a box
      const numOfItems = box.items.length + files.length;
      if (numOfItems > 7) {
        throw Error('You can only have 7 items in a box');
      }

      // Check to see if file with same name already exists
      const names = box.items.map(item => item.name) as string[];
      for (let i = 0; i < files.length; i++) {
        if (names.includes(files[i].name)) {
          throw Error(`File with name "${files[i].name}" already exists in a box`);
        }
      }

      // Add each file to storage and database
      const uid = currentUser.uid as string;
      for (let i = 0; i < files.length; i++) {
        const fileRef = ref(storage, `boxes/${uid}/${boxid}/${files[i].name}`);
        await uploadBytes(fileRef, files[i]);
        const url = await getDownloadURL(fileRef);
        await updateDoc(boxContentRef, {
          items: arrayUnion({
            name: files[i].name,
            type: files[i].type,
            size: files[i].size,
            url,
          }),
        });
      }

      // Refresh box
      getBox();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const changeFront = async (frontUrl: string) => {
    setError('');

    try {
      if (!currentUser || !box) {
        router.push('/login');
        throw Error('');
      }

      if (frontUrl === box.frontURL) {
        return;
      }

      await updateDoc(doc(db, 'boxes', box.boxid), {
        frontURL: frontUrl,
      });

      closeModal();
      getBox();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const deleteItem = async (e: any) => {
    setError('');
    try {
      if (!currentUser || !box) {
        router.push('/login');
        throw Error('');
      }

      const item = box.items[e.target.value];

      if (!item) {
        throw Error('Item not found');
      }

      // Remove item from storage and database
      await deleteObject(
        ref(storage, `boxes/${currentUser.uid}/${boxid}/${item.name}`)
      );
      await updateDoc(boxContentRef, {
        items: arrayRemove(item),
      });

      // Refresh box
      getBox();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const deleteBox = async () => {
    setError('');
    setDeleting(true);
    try {
      if (!currentUser || !box) {
        router.push('/login');
        throw Error('');
      }

      const items = await listAll(ref(storage, `boxes/${currentUser.uid}/${boxid}`));

      // Delete all items from storage and database
      for (const item of items.prefixes) {
        await deleteObject(
          ref(storage, `boxes/${currentUser.uid}/${boxid}/${item}`)
        );
      }
      await deleteDoc(boxContentRef);
      await deleteDoc(boxKeyRef);
      await deleteDoc(boxFrontRef);

      // If success go to profile dasboard
      router.push('/profile-dashboard');
    } catch (error: any) {
      setError(error.message);
    }
    setDeleting(false);
  };

  const onSubmit = handleSubmit(async (data) => {
    setError('');
    try {
      if (!currentUser || !box) {
        router.push('/login');
        throw Error('');
      }

      if (data.key !== box.key) {
        await updateDoc(boxKeyRef, {
          value: data.key
        });
      }

      if (data.unlocked !== box.unlocked) {
        await updateDoc(boxFrontRef, {
          unlocked: data.unlocked
        });
      }

      router.push(`/box/${boxid}`);
    } catch (error: any) {
      setError(error.message);
    }
  });

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    check();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (<>
    <div className="container">
      {error && <ErrorText>{error}</ErrorText>}

      {box && <>
        <StyledBoxFront>
          <div>Box front:</div>
          <Image src={box.frontURL} width={80} height={45} alt={'Box front'} />
          <button onClick={() => { setModalIsOpen(true); }}>Change</button>
        </StyledBoxFront>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Key enter"
          style={{
            content: {
              top: '10rem',
              bottom: 'auto',
            }
          }}
        >
          <CloseModal>
            <div onClick={closeModal}>
              Cancel
            </div>
          </CloseModal>
          {error && <ErrorText>{error}</ErrorText>}
          <ChangeBoxFrontForm
            changeFront={changeFront}
          />
        </Modal>
      </>}

      {box && box.items.map((item, index) => (
        <BoxItem key={item.url}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <div>{item.name}</div><div>{item.type}</div>
          </a>
          <button onClick={deleteItem} value={index} type="button">Delete</button>
        </BoxItem>
      ))}

      {box && <AddFilesForm addFiles={addFiles} />}

      {box && <form onSubmit={onSubmit}>
        <FormControl>
          <label htmlFor="key">Key:</label>
          <input
            type="text"
            defaultValue={box.key}
            {...register('key', {
              required: 'Box must have an key'
            })}
          />
        </FormControl>
        <Submit>
          <label>
            <input
              type="checkbox"
              defaultChecked={box.unlocked}
              {...register('unlocked')}
            />
            Unlocked?
          </label>
          <Button type="submit" disabled={isSubmitting}>Done</Button>
        </Submit>
      </form>}
      <Button
        onClick={deleteBox}
        disabled={deleting}
        style={{ marginTop: '2rem', backgroundColor: 'red' }}
      >
        Delete box
      </Button>
    </div>
  </>);
};

export default EditBox;

const ErrorText = styled.div`
  font-size: 1.2rem;
  color: #f22;
`;

const BoxItem = styled.div`
  margin: 1rem;
  display: flex;

  a {
    padding: 1rem 2rem;
    border: 1px solid gray;
    flex-grow: 1;
    display: flex;
    gap: 0.5rem;

    div {
      display: inline-block;
      max-width: 15ch;
      overflow: hidden; 
      white-space: nowrap; 
      text-overflow: ellipsis;
    }
  }

  button {
    padding: 1rem 2rem;
    border: 1px solid gray;
    background-color: aqua;
    cursor: pointer;
  }
`;

const StyledBoxFront = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1.4rem;

  div {
    font-size: 1.2rem;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: aliceblue;
    border: 1px solid gray;
    cursor: pointer;
    margin-left: 2rem;
  }
`;

const CloseModal = styled.div`
  display: flex;
  justify-content: flex-end;

  div {
    cursor: pointer;
  }
`;
