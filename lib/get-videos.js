import videoTestData from '../data/videos.json';

async function fetchVideos(SEARCH_URL) {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  const YOUTUBE_API_URL = 'youtube.googleapis.com/youtube/v3';

  const response = await fetch(
    `https://${YOUTUBE_API_URL}/${SEARCH_URL}&maxResults=25&key=${YOUTUBE_API_KEY}`
  );

  return await response.json();
}

export async function getCommonVideos(SEARCH_URL) {
  try {
    // Use dummy test data to not exceed YouTube quota limits while developing
    const isDev = process.env.DEVELOPMENT;
    const data = isDev ? videoTestData : await fetchVideos(SEARCH_URL);

    if (data?.error) {
      console.error(data.error);
      return [];
    }

    return data?.items.map(item => {
      const id = item.id?.videoId || item.id;
      return {
        title: item.snippet.title,
        imgUrl: item.snippet.thumbnails.high.url, 
        description: item.snippet.description, 
        publishedAt: item.snippet.publishedAt, 
        channelTitle: item.snippet.channelTitle, 
        viewCount: item.statistics ? item.statistics.viewCount : { viewCount: 0 }, 
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

export function getVideoById(videoId) {
  const SEARCH_URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;
  return getCommonVideos(SEARCH_URL);
};
