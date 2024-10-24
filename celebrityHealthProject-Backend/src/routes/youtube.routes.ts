import express from 'express';
import axios from 'axios';

const router = express.Router();

// Get videos by ID
router.get('/videos/:videoId', async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const videoId = req.params.videoId;

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        key: apiKey,
        id: videoId,
        part: 'snippet,contentDetails,statistics',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
});

// Get videos from a playlist
router.get('/playlistItems', async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const { playlistId, maxResults } = req.query;

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        key: apiKey,
        playlistId,
        part: 'snippet,contentDetails',
        maxResults,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    res.status(500).json({ error: 'Failed to fetch playlist items' });
  }
});

// Search videos in a channel
router.get('/search', async (req, res) => {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const { query, channelId, maxResults } = req.query;

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: apiKey,
        q: query,
        channelId,
        part: 'snippet',
        type: 'video',
        maxResults,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error searching videos:', error);
    res.status(500).json({ error: 'Failed to search videos' });
  }
});

export default router;