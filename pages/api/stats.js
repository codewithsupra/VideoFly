import {
  findVideoByUser,
  updateStats,
  insertStats,
} from '../../lib/db-hasura';
import { verifyToken } from '../../lib/utils';

export default async function stats(req, res) {
  try {
    const token = req.cookies.token;
    const inputParams = req.method === 'POST' ? req.body : req.query;
    const { videoId } = inputParams;

    if (!token || !videoId) {
      res.status(403).send({});
    } else {
      const userId = await verifyToken(token);

      const videoData = await findVideoByUser(token, userId, videoId);
      const doesStatsExist = videoData?.length > 0;

      if (req.method === 'POST') {
        const { favourited, watched = true } = req.body;

        if (doesStatsExist) {
          const result = await updateStats(token, {
            userId, 
            videoId,
            favourited, 
            watched
          });
          res.send( {message: 'updating stats works', updateStats: result.data });
        } else {
          const result = await insertStats(token, {
            userId, 
            videoId,
            favourited, 
            watched 
          });
          res.send( {message: 'inserting stats works', insertStats: result.data });
        }

      } else if (req.method === 'GET') {

        if (doesStatsExist) {
          res.send(videoData);
        } else {
          res.status(404);
          res.send({ user: null, msg: 'Video not found' });
        }

      }
    }

  } catch (error) {
    console.error('Error occurred at /stats', error);
    res.status(500).send({ done: false, error: error?.message });
  }
}
