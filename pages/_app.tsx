import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/auth';
import MobileNav from '../components/mobile-nav';
import Navbar from '../components/navbar';
import { ChakraProvider } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <AuthProvider>
      <ChakraProvider>
        <div className="layout">
          <Navbar />
          <main>
            <Component {...pageProps} />
          </main>
          <MobileNav />
        </div>
      </ChakraProvider>
    </AuthProvider>
  </>;
}

export default MyApp;
