import Head from 'next/head';
import NavBar from '../../components/nav/NavBar';

import SectionCards from '../../components/card/SectionCards';
import { VerifyUser } from '../../hooks/useVerifyUser';
import { getMyListVideos } from '../../lib/get-videos';
import styles from '../../styles/MyList.module.css';

function MyList({ myListVideos }) {
  return (
    <div>
      <Head>
        <title>My List - Netfilmix</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            title="My Favourited Videos"
            videos={myListVideos}
            size="small"
            shouldWrap
            shouldScale={false}
          />
        </div>
      </main>
    </div>
  );
}

export default MyList;


export async function getServerSideProps(context) {
  const { userId, token } = await VerifyUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const videos = await getMyListVideos(userId, token);

  return {
    props: {
      myListVideos: videos,
    },
  };
}
