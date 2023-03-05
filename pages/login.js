import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { magicClient } from '../lib/magic-client';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [userEmail, setUserEmail] = useState('');
  const [userMsg, setUserMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // useEffect() here is for to subscribe on router events is to prevent 
  // switching from 'Loading...' to 'Sign In' before redirection happened
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

  function enteredEmailHandler(event) {
    setUserMsg('');
    setUserEmail(event.target.value); 
  }

  async function signInButtonHandler(event) {
    event.preventDefault();
    
    if (userEmail.trim() !== '' && userEmail.includes('@')) {
      // add more complex validation here, or on the serverside if there will be some code 
      // before sending magic link, anyway it must have to be to prevent interruption
      if (userEmail) {  
        setUserMsg('');
        setIsLoading(true);
        // if it's all OK, including checking email in DB, then
        
        try {
          const DIDToken = await magicClient.auth.loginWithMagicLink({ email: userEmail });

          if (DIDToken) {
            router.push('/');
          }

        } catch (error) {
          setIsLoading(false);
          console.error('Something went wrong with loggin in!', error);
        }

      }
      else {
        setUserMsg('Please enter a valid email address!');
      }
    }
    else {
      setUserMsg('Please enter a valid email address!');
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Netfilmix Sign In</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/" >
            <div className={styles.logoWrapper}>
              <Image
                src="/icons/netflix.svg"
                alt="Netfilmix logo"
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input 
            type="text" 
            placeholder="Email Address" 
            className={styles.emailInput} 
            onChange={enteredEmailHandler}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button 
            className={styles.loginBtn} 
            onClick={signInButtonHandler}
          >
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  );
}
