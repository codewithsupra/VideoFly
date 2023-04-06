import Link from 'next/link';
import clsx from 'classnames';

import Card from './Card';
import styles from './SectionCards.module.css';

function SectionCards(props) {
  const { title, videos = [], size, shouldWrap = false, shouldScale } = props;

  // Could add arrows in horizontal scrolling for better UI
  // https://www.npmjs.com/package/react-horizontal-scrolling-menu
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={clsx(styles.cardWrapper, shouldWrap && styles.shouldWrapper)}>
        {videos.map((video, idx) => {
          return (
            <Link href={`/video/${video.id}`} key={video.id}>
              <Card
                id={idx} 
                key={idx}
                imgUrl={video.imgUrl}
                size={size} 
                shouldScale={shouldScale}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default SectionCards;
