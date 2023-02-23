import Head from 'next/head';

import Banner from '../components/banner/Banner';
import SectionCards from '../components/card/SectionCards';
import NavBar from '../components/nav/NavBar';
import styles from '../styles/Home.module.css';

export default function Home() {
  // Dummy "videos" for now
  const disneyVideos = [
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
    { imgUrl: "/images/clifford.webp" },
  ];
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - Netfilmix</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar username="email@gmail.com"/>

      <Banner 
        title="Clifford the red dog" 
        subTitle="A very cute and big dog" 
        imgUrl="/images/clifford.webp"
      />
      <div className={styles.sectionWrapper}>
        <SectionCards title="Disney" videos={disneyVideos} size="large" />
        <SectionCards title="Productivity Videos" videos={disneyVideos} size="medium" />
      </div>
    </div>
  );
}
