import { NextPage } from 'next';
import PasswordResetForm from '../components/password-reset-form';

const PasswordReset: NextPage = () => {
  return (
    <div className="container">
      <PasswordResetForm />
    </div>
  );
};

export default PasswordReset;
