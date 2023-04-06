import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import clsx from 'classnames';

import NavBar from '../../components/nav/NavBar';
import styles from '../../styles/Video.module.css';
import { getVideoById } from '../../lib/get-videos';
import Like from '../../components/icons/LikeIcon';
import DisLike from '../../components/icons/DislikeIcon';

Modal.setAppElement('#__next');

function Video({ video }) {
  const router = useRouter();
  const videoId = router.query.videoId;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  useEffect(() => {
    const handleLikeDislikeService = async () => {
      const response = await fetch(`/api/stats?videoId=${videoId}`, {
        method: 'GET'
      });
      const data = await response.json();

      if (data.length > 0) {
        const favourited = data[0].favourited;
        if (favourited === 1) {
          setToggleLike(true);
        } else if (favourited === 0) {
          setToggleDisLike(true);
        }
      }
    };
    handleLikeDislikeService();
  }, [videoId]);

  async function runRatingService(favourited) {
    return await fetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        favourited
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async function toggleDisLikeHandler() {
    setToggleDisLike(!toggleDisLike);
    setToggleLike(toggleDisLike);

    const response = await runRatingService(0);
  }

  async function toggleLikeHandler() {
    setToggleLike(!toggleLike);
    setToggleDisLike(toggleLike);

    const response = await runRatingService(1);
  }

  function playerEventHandler(event) {
    console.log(event);
  }

  return (
    <div className={styles.container}>
      <NavBar />
      <Modal
        isOpen={true}
        onRequestClose={() => router.back()}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Watch the video"
      >
        <iframe 
          className={styles.videoPlayer} 
          id="player" 
          type="text/html" 
          width="100%" 
          height="360"
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com&controls=0&rel=0`}
        ></iframe>

        <div className={styles.likeDislikeBtnWrapper}>
          <div className={styles.likeBtnWrapper}>
            <button onClick={toggleLikeHandler}>
              <div className={styles.btnWrapper}>
                <Like selected={toggleLike} />
              </div>
            </button>
          </div>
          <button onClick={toggleDisLikeHandler}>
            <div className={styles.btnWrapper}>
              <DisLike selected={toggleDisLike} />
            </div>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Video;


export async function getStaticProps(context) {
  const video = await getVideoById(context.params.videoId);

  return {
    props: {
      video: video.length > 0 ? video[0] : {}
    },
    revalidate: 10
  };
}


export async function getStaticPaths() {
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ'];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: 'blocking' };
}
