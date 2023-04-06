import Head from 'next/head';

import Banner from '../components/banner/Banner';
import SectionCards from '../components/card/SectionCards';
import NavBar from '../components/nav/NavBar';
import { getVideos, getPopularVideos, getWatchItAgainVideos } from '../lib/get-videos';
import styles from '../styles/Home.module.css';
import { useVerifyUser } from '../hooks/useVerifyUser';

export default function Home({ 
  watchItAgainVideos,
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
          videoId="4zH5iYM4wJo"
          title="Clifford the red dog" 
          subTitle="A very cute and big dog" 
          imgUrl="/images/clifford.webp"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards title="Watch it Again" videos={watchItAgainVideos} size="small" />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards title="Productivity Videos" videos={productivityVideos} size="medium" />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}


export async function getServerSideProps(context) {
  const { userId, token } = await useVerifyUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  const watchItAgainVideos = await getWatchItAgainVideos(userId, token);
  const disneyVideos = await getVideos('disney%23trailer');
  const travelVideos = await getVideos('travel');
  const productivityVideos = await getVideos('Productivity');
  const popularVideos = await getPopularVideos();

  return { 
    props: { 
      watchItAgainVideos,
      disneyVideos, 
      travelVideos, 
      productivityVideos, 
      popularVideos 
    } 
  };
}
