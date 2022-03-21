import styled from '@emotion/styled';
import { BoxContentType } from '../types';

const Box = (box: BoxContentType) => {
  const { items } = box;

  return (
    <StyledBox>
      {items.map((item, index) => (
        <A
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Item {index + 1}, type: {item.type}
        </A>
      ))}
    </StyledBox>
  );
};

export default Box;

const A = styled.a`
  padding: 1rem 2rem;
  border: 1px solid gray;
`;

const StyledBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;