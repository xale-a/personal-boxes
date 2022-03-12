import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { auth } from '../utils/firebase';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';

// Type for children props
type AuthProps = {
  children: ReactNode;
};

// Type for context
type ContextValue = {
  currentUser: User | null;
  signUp: typeof signUp;
  logIn: typeof logIn;
  logOut: typeof logOut;
  passwordReset: typeof passwordReset;
};

// Auth functions
const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

const logIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

const logOut = () => {
  return signOut(auth);
};

const passwordReset = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

const authFunctions = {
  signUp,
  logIn,
  logOut,
  passwordReset,
};

// Auth context
const AuthContext = createContext<ContextValue>({
  currentUser: null,
  ...authFunctions
});

export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider
export const AuthProvider = ({ children }: AuthProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const value: ContextValue = {
    currentUser,
    ...authFunctions
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
