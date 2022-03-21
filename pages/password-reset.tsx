import { NextPage } from 'next';
import Head from 'next/head';
import AuthContainer from '../components/auth-container';
import PasswordResetForm from '../components/password-reset-form';

const PasswordReset: NextPage = () => {
  return (
    <AuthContainer>

      <Head>
        <title>Reset Password | Personal Boxes</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <PasswordResetForm />

    </AuthContainer>
  );
};

export default PasswordReset;
