import { Center, Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

type AuthContainerProps = {
  children: ReactNode;
};

const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <Center minH='100%' maxW={['xs', 'md']} mx='auto'>
      <Box w='100%' padding='5' borderWidth='thin' borderRadius='md'>
        {children}
      </Box>
    </Center>
  );
};

export default AuthContainer;
