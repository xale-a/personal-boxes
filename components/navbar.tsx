import Link from 'next/link';
import styled from 'styled-components';

const Navbar = () => {
  return (
    <Nav>
      <Link href="/"><a><h1>Personal Boxes</h1></a></Link>
      <Link href="/profile" passHref><Profile>P</Profile></Link>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: aliceblue;
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Profile = styled.div`
  border: 1px solid black;
  border-radius: 50%;
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
