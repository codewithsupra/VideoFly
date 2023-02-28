//import videoData from '../data/videos.json';

export async function getCommonVideos(SEARCH_URL) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = 'youtube.googleapis.com/youtube/v3';
  
  try {
    const response = await fetch(
      `https://${YOUTUBE_API_URL}/${SEARCH_URL}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    if (data?.error) {
      console.error(data.error);
      return [];
    }

    return data?.items.map(item => {
      const id = item.id?.videoId || item.id;
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url,
        id
      }
    });
  } catch (error) {
    console.error('Something went wrong with fetching videos', error);
    return [];
  }
}

export function getVideos(searchQuery) {
  const SEARCH_URL = `search?part=snippet&q=${searchQuery}&type=video`;
  return getCommonVideos(SEARCH_URL);
};

export function getPopularVideos() {
  const SEARCH_URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US`;
  return getCommonVideos(SEARCH_URL);
};
