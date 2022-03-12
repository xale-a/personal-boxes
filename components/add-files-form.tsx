import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button } from './shared/buttons';
import { Submit } from './shared/form';

type FormData = {
  files: FileList;
};

type Item = {
  name: string;
  type: string;
  size: number;
};

type Props = {
  addFiles: (files: FileList) => Promise<void>;
};

const AddFilesForm = ({ addFiles }: Props) => {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: {
      isSubmitSuccessful,
      isSubmitting
    }
  } = useForm<FormData>();

  const files = watch('files');

  useEffect(() => {
    // New files info
    if (!files) {
      setItems([]);
      return;
    }
    const newItems: Item[] = [];
    for (let i = 0; i < files.length; i++) {
      newItems.push({
        name: files[i].name,
        type: files[i].type,
        size: files[i].size,
      });
    }
    setItems([...newItems]);
  }, [files]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = handleSubmit(async (data) => {
    setError('');
    try {
      await addFiles((data.files));
    } catch (error: any) {
      setError(error.message);
    }
  });

  return (
    <form onSubmit={onSubmit} style={{ backgroundColor: 'lightgray', padding: '0.5rem' }}>
      {error && <div>{error}</div>}
      <NewItems>
        {items && items.map((item) => (
          <NewItem key={item.name}>
            <div>{item.name}</div>
            <div>{item.type}</div>
            <div>{item.size}</div>
          </NewItem>
        ))}
      </NewItems>
      <Submit>
        <AddNewFiles>
          <input
            type="file"
            multiple
            {...register('files')}
          />
          <div>Pick new files</div>
        </AddNewFiles>
        <Button type="submit" disabled={isSubmitting}>Add files</Button>
      </Submit>
    </form>
  );
};

export default AddFilesForm;

const NewItems = styled.div`
  display: flex;
  flex-direction: column;
`;

const NewItem = styled.div`
  margin-bottom: 0.5rem;
`;

const AddNewFiles = styled.label`
  input {
    opacity: 0;
    position: absolute;
    left: -9999px;
  }

  div {
    cursor: pointer;
    padding: 0.5rem 1.5rem;
    background-color: aqua;
    border: 1px solid gray;
    margin-right: 1rem;
  }
`;
