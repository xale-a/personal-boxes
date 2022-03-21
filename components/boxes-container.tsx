import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

type BoxContainerProps = {
  children: ReactNode;
};

const BoxesContainer = ({ children }: BoxContainerProps) => {
  return (
    <Flex px='10' py='4' flexWrap='wrap' gap='3' alignItems='center'>
      {children}
    </Flex>
  );
};

export default BoxesContainer;
