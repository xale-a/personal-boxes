import type { NextPage } from 'next';
import SignUpForm from '../components/signup-form';

const SignUp: NextPage = () => {
  return (
    <div className="container">
      <SignUpForm />
    </div>
  );
};

export default SignUp;
