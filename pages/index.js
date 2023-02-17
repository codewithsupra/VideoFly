import Head from 'next/head';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - Netfilmix</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Netfilmix</h1>
    </div>
  );
}
