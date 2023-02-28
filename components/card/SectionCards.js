import Card from './Card';
import styles from './SectionCards.module.css';

function SectionCards(props) {
  const { title, videos = [], size } = props;

  // Could add arrows in horizontal scrolling for better UI
  // https://www.npmjs.com/package/react-horizontal-scrolling-menu
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, idx) => {
          return (
            <Card
              id={idx} 
              key={idx}
              imgUrl={video.imgUrl}
              size={size}
            />
          );
        })}
      </div>
    </section>
  );
}

export default SectionCards;
