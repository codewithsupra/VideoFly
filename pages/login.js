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
    
    // could add more complex validation here
    if (userEmail.trim() !== '' && userEmail.includes('@')) {  
      setUserMsg('');
      setIsLoading(true);
      
      try {
        const DIDToken = await magicClient.auth.loginWithMagicLink({ email: userEmail });

        if (DIDToken) {
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${DIDToken}`,
              'Content-Type': 'application/json',
            },
          });

          const loggedInResponse = await response.json();

          //console.log(loggedInResponse);
          if (loggedInResponse.done) {
            router.push('/');
          } else {
            setIsLoading(false);
            setUserMsg('Something went wrong logging in');
          }
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
