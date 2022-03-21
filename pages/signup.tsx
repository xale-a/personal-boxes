import type { NextPage } from 'next';
import Head from 'next/head';
import AuthContainer from '../components/auth-container';
import SignUpForm from '../components/signup-form';

const SignUp: NextPage = () => {
  return (
    <AuthContainer>
      <Head>
        <title>Create an account | Personal Boxes</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <SignUpForm />

    </AuthContainer>
  );
};

export default SignUp;
