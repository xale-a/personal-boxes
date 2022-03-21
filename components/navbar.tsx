import Link from 'next/link';
import { Avatar, Flex, Heading, Menu, MenuButton, MenuGroup, MenuItem, MenuList, Spacer } from '@chakra-ui/react';
import { useAuth } from '../contexts/auth';
import { useRouter } from 'next/router';

const Navbar = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  return (
    <Flex px='5' py='3' backgroundColor='purple.800'>

      <Link href='/'>
        <a><Heading as='h1' color='white'>Personal Boxes</Heading></a>
      </Link>

      <Spacer />

      <Menu>
        <MenuButton as={Avatar} src={currentUser?.photoURL || ''} cursor='pointer' />
        <MenuList>
          {currentUser ? <>
            <MenuGroup>
              <MenuItem onClick={() => { router.push('/profile'); }}>
                Edit profile
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuItem onClick={() => { router.push('/logout'); }}>
                Sign Out
              </MenuItem>
            </MenuGroup>
          </> : <>
            <MenuItem onClick={() => { router.push('/signup'); }}>
              Create an account
            </MenuItem>
            <MenuItem onClick={() => { router.push('/login'); }}>
              Sign in
            </MenuItem>
          </>}
        </MenuList>
      </Menu>

    </Flex >
  );
};

export default Navbar;
