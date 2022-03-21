import { Box, Button, Flex, SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { BoxFrontType } from '../types';
import Image from 'next/image';
import { useRouter } from 'next/router';

type BoxFrontProps = {
  boxFront: BoxFrontType;
};

const BoxFront = ({ boxFront }: BoxFrontProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <Box position='relative'>
      {/* <Box position='relative' mb='3' maxW='22.4rem'> */}

      <Flex cursor='pointer'>
        <Image
          src={boxFront.frontURL}
          width={1920}
          height={1080}
          alt='Front of a box'
          onClick={onOpen}
        />
      </Flex>

      {isOpen && (
        <Flex
          position='absolute'
          top='0'
          bottom='0'
          left='0'
          right='0'
          backgroundColor='rgba(0, 0, 0, 0.7)'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          gap='12'
        >
          <SimpleGrid
            templateColumns='repeat(2, max-content)'
            columnGap='3'
            rowGap='1'
            color='white'
          >
            <Box>
              BoxID:
            </Box>
            <Box>
              {boxFront.boxid}
            </Box>
            <Box>
              Unlocked:
            </Box>
            <Box>
              {boxFront.unlocked ? 'Yes' : 'No'}
            </Box>
          </SimpleGrid>

          <Flex
            gap='12'
            mb='-12'
          >
            <Button
              variant='ghost'
              onClick={onClose}
              colorScheme='whiteAlpha'
              color='white'
            >
              Close
            </Button>
            <Button
              onClick={() => { router.push(`/box/${boxFront.boxid}`); }}
            >
              Open Box
            </Button>
          </Flex>

        </Flex>
      )}
    </Box>
  );
};

export default BoxFront;
