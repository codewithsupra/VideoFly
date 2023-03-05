import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import '../styles/globals.css'
import { magicClient } from '../lib/magic-client';
import Loader from '../components/loader/Loader';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function doRoutingTo() {
      const isLoggedIn = await magicClient.user.isLoggedIn();

      if (isLoggedIn) {
        router.push('/');
      } else {
        router.push('/login');
      }
    }

    doRoutingTo();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return isLoading ? <Loader /> : <Component {...pageProps} />;
}

export default MyApp
