import { default as NextLink } from 'next/link';
import { useRouter } from 'next/router';
import { Circle, Grid, Link } from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/auth';

const MobileNav = () => {
  const [currentPage, setCurrentPage] = useState('');
  const { currentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setCurrentPage(router.pathname);
  }, [router.pathname]);

  return (<>
    <Grid
      templateColumns='1fr max-content 1fr'
      alignItems='center'
      justifyItems='center'
      py='2.5'
      backgroundColor='purple.800'
    >

      <NextLink href='/' passHref>
        <Link
          fontSize='xl'
          color={currentPage === '/' ? 'white' : 'gray.400'}
        >
          All boxes
        </Link>
      </NextLink>

      {currentPage === '/profile-dashboard' || currentPage === '/create-box' ? <>
        <NextLink href='/create-box' passHref>
          <Circle
            border='1px'
            borderColor='gray.200'
            p='2.5'
            backgroundColor='purple.800'
            style={{ cursor: 'pointer' }}
          >
            <AddIcon w='27' h='27' color='gray.300' />
          </Circle>
        </NextLink>
      </> : <>
        <NextLink href='/search' passHref>
          <Circle
            border='1px'
            borderColor='gray.200'
            p='2.5'
            backgroundColor='purple.800'
            style={{ cursor: 'pointer' }}
          >
            <SearchIcon w='27' h='27' color='gray.300' />
          </Circle>
        </NextLink>
      </>}


      <NextLink
        href={currentUser ? '/profile-dashboard' : '/login'}
        passHref
      >
        <Link
          fontSize='xl'
          color={currentPage === '/profile-dashboard' ? 'white' : 'gray.300'}
        >
          My boxes
        </Link>
      </NextLink>

    </Grid>
  </>);
};

export default MobileNav;
