import type { NextPage } from 'next';
import LogInForm from '../components/login-form';

const LogIn: NextPage = () => {
  return (
    <div className="container">
      <LogInForm />
    </div>
  );
};

export default LogIn;
