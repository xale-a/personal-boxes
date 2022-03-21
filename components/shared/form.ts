import styled from '@emotion/styled';

export const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  width: min(90vw, 22rem);

  label {
    font-size: 0.95rem;
    margin-bottom: 0.1rem;
  }

  input {
    padding: 0.5rem 1rem;
    border: 1px solid gray;
    font-size: 1.1rem;
    border-radius: 2px;
  }

  div {
    color: red;
    font-size: 0.95rem;
  }
`;

export const Submit = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    cursor: pointer;
    font-size: 1.2rem;
  }
`;
