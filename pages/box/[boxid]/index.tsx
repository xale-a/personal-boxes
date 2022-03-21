import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import { useAuth } from '../../../contexts/auth';
import Modal from 'react-modal';
import { FormControl } from '../../../components/shared/form';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/shared/buttons';
import type { BoxContentType } from '../../../types';
import { db } from '../../../utils/firebase';
import Box from '../../../components/box';
import Link from 'next/link';
import styled from '@emotion/styled';

type FormData = {
  key: string;
};

Modal.setAppElement("#__next");

const UnlockBox: NextPage = () => {
  const [box, setBox] = useState<BoxContentType>();
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState('');
  const [flag, setFlag] = useState(false);
  const [keyError, setKeyError] = useState('');
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [owner, setOwner] = useState(false);
  const { register, handleSubmit, resetField, formState: { isSubmitted, isSubmitting } } = useForm<FormData>();
  const router = useRouter();
  const { boxid } = router.query;
  const { currentUser } = useAuth();

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const getKey = async () => {
    setError('');
    try {
      const boxKeySnap = await getDoc(doc(db, 'boxes', boxid as string, 'private', 'key'));

      if (!boxKeySnap.exists()) {
        throw Error('Key doesn\'t exist');
      }

      setShowKey(boxKeySnap.data().value);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const onSubmit = handleSubmit((data) => {
    setKey(data.key);
    resetField('key');
  });

  const getBox = async (key: string) => {
    try {
      if (currentUser && !flag) {
        // Bypass for box owner
        const boxInfoSnap = await getDoc(doc(db, 'boxes', boxid as string));
        if (boxInfoSnap.exists() && (boxInfoSnap.data().ownerid === currentUser.uid)) {
          const boxContentSnap = await getDoc(doc(db, 'boxes', boxid as string, 'private', 'content'));
          if (boxContentSnap.exists()) {
            setOwner(true);
            return setBox(boxContentSnap.data() as BoxContentType);
          }
        }

        // Try to get saved user key if logged in
        const userKeySnap = await getDoc(doc(db, 'users', currentUser.uid as string, 'keys', '' + boxid));
        if (userKeySnap.exists()) {
          key = userKeySnap.data().value;
        }

        // Only run this once
        setFlag(true);
      }

      // Try to unlock
      const data = await axios('/api/unlock-box', {
        params: {
          boxid: boxid,
          uid: currentUser?.uid,
          key: key,
        }
      });

      // If here - it's unlocked
      closeModal();
      setBox(data.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        // Open enter key modal
        if (isSubmitted || isSubmitting) {
          setKeyError('Wrong key, try again');
        }
        openModal();
      } else if (error.response?.status === 404) {
        // Box doesn't exist
        setError('Box doesn\'t exist');
      } else {
        setError('Server error, please try again');
      }
    }
  };

  useEffect(() => {
    getBox(key);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Key enter"
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc={false}
        style={{
          content: {
            top: '8rem',
          }
        }}
      >
        {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
        <h2>This box is locked</h2>
        <form onSubmit={onSubmit}>
          <FormControl>
            <label htmlFor="key">Enter key:</label>
            <input type="text" {...register('key')} autoComplete="off" autoFocus />
            {keyError && <div>{keyError}</div>}
          </FormControl>
          <Button type="submit">Unlock</Button>
        </form>
      </Modal>
      {!error ? <>
        {box ? <>
          {<h2>{boxid}</h2>}
          <Box {...box}></Box>
          {owner && <>
            <OwnerOptions>
              <ShowKey>
                <div style={{ display: showKey.length !== 0 ? 'inline-block' : 'none' }}>{showKey}</div>
                <button
                  onClick={getKey}
                  style={{ display: showKey.length !== 0 ? 'none' : 'inline-block' }}
                >
                  Show key
                </button>
              </ShowKey>
              <Link href={`/box/${boxid}/edit`} passHref>
                <Button>Edit</Button>
              </Link>
            </OwnerOptions>
          </>}
        </> : <>
          <p>Loading...</p>
        </>}
      </> : <>
        <div>{error}</div>
      </>}
    </div>
  );
};

export default UnlockBox;

const ShowKey = styled.div`
  border: 1px solid gray;

  div {
    padding: 0.6rem 1.2rem;
  }

  button {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
`;

const OwnerOptions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
`;