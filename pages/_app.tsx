import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/auth';
import MobileNav from '../components/mobile-nav';
import Navbar from '../components/navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
      <MobileNav />
    </AuthProvider>
  </>;
}

export default MyApp;
