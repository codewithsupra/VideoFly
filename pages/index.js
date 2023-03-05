import Head from 'next/head';

import Banner from '../components/banner/Banner';
import SectionCards from '../components/card/SectionCards';
import NavBar from '../components/nav/NavBar';
import { getVideos, getPopularVideos } from '../lib/get-videos';
import styles from '../styles/Home.module.css';

export default function Home({ 
  disneyVideos, 
  travelVideos, 
  productivityVideos, 
  popularVideos 
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home - Netfilmix</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <NavBar />

        <Banner 
          title="Clifford the red dog" 
          subTitle="A very cute and big dog" 
          imgUrl="/images/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards title="Productivity Videos" videos={productivityVideos} size="medium" />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}


export async function getServerSideProps() {
  const disneyVideos = await getVideos("disney%23trailer");
  const travelVideos = await getVideos("travel");
  const productivityVideos = await getVideos("Productivity");
  const popularVideos = await getPopularVideos();

  return { 
    props: { 
      disneyVideos, 
      travelVideos, 
      productivityVideos, 
      popularVideos 
    } 
  };
}
