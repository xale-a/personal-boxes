import type { NextPage } from 'next';
import Head from 'next/head';
import AuthContainer from '../components/auth-container';
import LogInForm from '../components/login-form';

const LogIn: NextPage = () => {
  return (
    <AuthContainer>

      <Head>
        <title>Sign In | Personal Boxes</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <LogInForm />

    </AuthContainer>
  );
};

export default LogIn;
