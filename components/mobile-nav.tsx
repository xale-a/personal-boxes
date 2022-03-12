import Link from 'next/link';
import Image from 'next/image';
import styled from 'styled-components';
import { useRouter } from 'next/router';

const MobileNav = () => {
  const router = useRouter();

  return (<>
    <Nav>
      <Link href="/" passHref><NavLink>All boxes</NavLink></Link>
      {router.pathname === '/profile-dashboard' ? <>
        <Link href="create-box" passHref>
          <NavButton>
            <Image src="/add.svg" alt="Search Icon" width={27} height={27} />
          </NavButton>
        </Link>
      </> : <>
        <Link href="search" passHref>
          <NavButton>
            <Image src="/search.svg" alt="Search Icon" width={27} height={27} />
          </NavButton>
        </Link>
      </>}
      <Link href="/profile-dashboard" passHref><NavLink>My boxes</NavLink></Link>
    </Nav>
  </>);
};

export default MobileNav;

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: aliceblue;
  padding: 1rem 2rem;
  gap: 1rem;
  font-size: 1.2rem;
  color: #333;
`;

const NavButton = styled.div`
  cursor: pointer;
  border: 1px solid black;
  border-radius: 50%;
  background-color: inherit;
  width: 3.06rem;
  height: 3.06rem;
  display: flex;
  justify-content: center;
`;

const NavLink = styled.a`
  font-size: 1.25rem;
`;
