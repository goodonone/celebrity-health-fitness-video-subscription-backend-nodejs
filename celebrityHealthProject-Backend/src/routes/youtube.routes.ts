// import express from 'express';
// import axios from 'axios';

// const router = express.Router();

// // Get videos by ID
// router.get('/videos/:videoId', async (req, res) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   const videoId = req.params.videoId;

//   try {
//     const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
//       params: {
//         key: apiKey,
//         id: videoId,
//         part: 'snippet,contentDetails,statistics',
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching video:', error);
//     res.status(500).json({ error: 'Failed to fetch video data' });
//   }
// });

// // Get videos from a playlist
// router.get('/playlistItems', async (req, res) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   const { playlistId, maxResults } = req.query;

//   try {
//     const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
//       params: {
//         key: apiKey,
//         playlistId,
//         part: 'snippet,contentDetails',
//         maxResults,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching playlist items:', error);
//     res.status(500).json({ error: 'Failed to fetch playlist items' });
//   }
// });

// // Search videos in a channel
// router.get('/search', async (req, res) => {
//   const apiKey = process.env.YOUTUBE_API_KEY;
//   const { query, channelId, maxResults } = req.query;

//   try {
//     const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
//       params: {
//         key: apiKey,
//         q: query,
//         channelId,
//         part: 'snippet',
//         type: 'video',
//         maxResults,
//       },
//     });
//     res.json(response.data);
//   } catch (error) {
//     console.error('Error searching videos:', error);
//     res.status(500).json({ error: 'Failed to search videos' });
//   }
// });




// import express from 'express';
// import axios, { AxiosError } from 'axios';

// const router = express.Router();

// // Helper function to make YouTube API requests with multiple keys
// async function makeYoutubeRequest(
//   url: string,
//   params: Record<string, any>
// ): Promise<any> {
//   // Split the API keys and trim any whitespace
//   const apiKeys = process.env.YOUTUBE_API_KEYS
//     ? process.env.YOUTUBE_API_KEYS.split(',').map(key => key.trim())
//     : [];
  
//   if (apiKeys.length === 0) {
//     throw new Error('No YouTube API keys provided in the environment variables.');
//   }

//   let lastError: any = null;

//   for (const apiKey of apiKeys) {
//     try {
//       const response = await axios.get(url, {
//         params: {
//           ...params,
//           key: apiKey,
//         },
//       });
//       return response;
//     } catch (error) {
//       lastError = error;

//       // Check if the error is due to quota limit
//       if (axios.isAxiosError(error) && error.response?.status === 403) {
//         const errors = (error.response.data as any).error.errors;
//         const quotaExceeded = errors.some(
//           (err: any) =>
//             err.reason === 'quotaExceeded' ||
//             err.reason === 'dailyLimitExceeded' ||
//             err.reason === 'userRateLimitExceeded'
//         );
//         if (quotaExceeded) {
//           console.warn(`API key ${apiKey} quota exceeded, trying next key...`);
//           continue; // Try the next API key
//         }
//       }
//       // For other errors, stop retrying
//       break;
//     }
//   }
//   // If all keys are exhausted or a non-quota error occurred
//   throw lastError;
// }

// // Get videos by ID
// router.get('/videos/:videoId', async (req, res) => {
//   const videoId = req.params.videoId;

//   try {
//     const response = await makeYoutubeRequest(
//       'https://www.googleapis.com/youtube/v3/videos',
//       {
//         id: videoId,
//         part: 'snippet,contentDetails,statistics',
//       }
//     );
//     res.json(response.data);
//   } catch (error) {
//     let message = 'Failed to fetch video data';
//     if (axios.isAxiosError(error)) {
//       // Attempt to extract a more specific error message
//       if (error.response?.data?.error?.message) {
//         message = error.response.data.error.message;
//       } else {
//         message = error.message;
//       }
//     }
//     console.error('Error fetching video:', message);
//     res.status(500).json({ error: message });
//   }
// });

// // Get videos from a playlist
// // router.get('/playlistItems', async (req, res) => {
// //   const { playlistId, maxResults } = req.query;

// //   // Validate query parameters
// //   if (!playlistId || typeof playlistId !== 'string') {
// //     return res.status(400).json({ error: 'Invalid or missing playlistId parameter.' });
// //   }

// //   if (maxResults && (isNaN(Number(maxResults)) || Number(maxResults) < 1 || Number(maxResults) > 50)) {
// //     return res.status(400).json({ error: 'maxResults must be a number between 1 and 50.' });
// //   }

// //   try {
// //     const response = await makeYoutubeRequest(
// //       'https://www.googleapis.com/youtube/v3/playlistItems',
// //       {
// //         playlistId,
// //         part: 'snippet,contentDetails',
// //         maxResults: maxResults ? Number(maxResults) : 5, // Default to 5 if not provided
// //       }
// //     );
// //     res.json(response.data);
// //   } catch (error) {
// //     let message = 'Failed to fetch playlist items';
// //     if (axios.isAxiosError(error)) {
// //       // Attempt to extract a more specific error message
// //       if (error.response?.data?.error?.message) {
// //         message = error.response.data.error.message;
// //       } else {
// //         message = error.message;
// //       }
// //     }
// //     console.error('Error fetching playlist items:', message);
// //     res.status(500).json({ error: message });
// //   }
// // });
// // Example for the /playlistItems route
// router.get('/playlistItems', async (req, res) => {
//   const { playlistId, maxResults } = req.query;

//   // Validate query parameters
//   if (!playlistId || typeof playlistId !== 'string') {
//     return res.status(400).json({ error: 'Invalid or missing playlistId parameter.' });
//   }

//   if (maxResults && (isNaN(Number(maxResults)) || Number(maxResults) < 1 || Number(maxResults) > 50)) {
//     return res.status(400).json({ error: 'maxResults must be a number between 1 and 50.' });
//   }

//   try {
//     const response = await makeYoutubeRequest(
//       'https://www.googleapis.com/youtube/v3/playlistItems',
//       {
//         playlistId,
//         part: 'snippet,contentDetails',
//         maxResults: maxResults ? Number(maxResults) : 5, // Default to 5 if not provided
//       }
//     );
//     res.json(response.data);
//   } catch (error) {
//     let message = 'Failed to fetch playlist items';
//     if (axios.isAxiosError(error)) {
//       // Log the full error response for debugging
//       console.error('YouTube API Error Response:', JSON.stringify(error.response?.data, null, 2));

//       // Attempt to extract a more specific error message
//       if (error.response?.data?.error?.message) {
//         message = error.response.data.error.message;
//       } else {
//         message = error.message;
//       }
//     }
//     console.error('Error fetching playlist items:', message);
//     res.status(500).json({ error: message });
//   }
// });

// // Search videos in a channel
// router.get('/search', async (req, res) => {
//   const { query, channelId, maxResults } = req.query;

//   // Validate query parameters
//   if (!query || typeof query !== 'string') {
//     return res.status(400).json({ error: 'Invalid or missing query parameter.' });
//   }

//   if (channelId && typeof channelId !== 'string') {
//     return res.status(400).json({ error: 'Invalid channelId parameter.' });
//   }

//   if (maxResults && (isNaN(Number(maxResults)) || Number(maxResults) < 1 || Number(maxResults) > 50)) {
//     return res.status(400).json({ error: 'maxResults must be a number between 1 and 50.' });
//   }

//   try {
//     const response = await makeYoutubeRequest(
//       'https://www.googleapis.com/youtube/v3/search',
//       {
//         q: query,
//         channelId,
//         part: 'snippet',
//         type: 'video',
//         maxResults: maxResults ? Number(maxResults) : 5, // Default to 5 if not provided
//       }
//     );
//     res.json(response.data);
//   } catch (error) {
//     let message = 'Failed to search videos';
//     if (axios.isAxiosError(error)) {
//       // Attempt to extract a more specific error message
//       if (error.response?.data?.error?.message) {
//         message = error.response.data.error.message;
//       } else {
//         message = error.message;
//       }
//     }
//     console.error('Error searching videos:', message);
//     res.status(500).json({ error: message });
//   }
// });

// export default router;

import express from 'express';
import axios from 'axios';

const router = express.Router();

// Helper function to make YouTube API requests with multiple keys
async function makeYoutubeRequest(
  url: string,
  params: Record<string, any>
): Promise<any> {
  const apiKeys = process.env.YOUTUBE_API_KEYS
    ? process.env.YOUTUBE_API_KEYS.split(',').map(key => key.trim())
    : [];
  
  if (apiKeys.length === 0) {
    throw new Error('No YouTube API keys provided in the environment variables.');
  }

  let lastError: any = null;

  for (const apiKey of apiKeys) {
    try {
      const response = await axios.get(url, {
        params: {
          ...params,
          key: apiKey,
        },
      });
      return response;
    } catch (error) {
      lastError = error;
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const errors = (error.response.data as any).error.errors;
        const quotaExceeded = errors.some(
          (err: any) =>
            err.reason === 'quotaExceeded' ||
            err.reason === 'dailyLimitExceeded' ||
            err.reason === 'userRateLimitExceeded'
        );
        if (quotaExceeded) {
          console.warn(`API key ${apiKey} quota exceeded, trying next key...`);
          continue;
        }
      }
      break;
    }
  }
  throw lastError;
}

// Get videos by ID
router.get('/videos/:videoId', async (req, res) => {
  try {
    const response = await makeYoutubeRequest(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        id: req.params.videoId,
        part: 'snippet,contentDetails,statistics',
      }
    );
    res.json(response.data);
  } catch (error: any) {
    handleError(error, res, 'Failed to fetch video data');
  }
});

// Get videos by category
router.get('/videos/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { maxResults = '10' } = req.query;

  try {
    const response = await makeYoutubeRequest(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        chart: 'mostPopular',
        videoCategoryId: categoryId,
        part: 'snippet,contentDetails,statistics',
        maxResults: Number(maxResults),
        regionCode: 'US' // You can make this configurable
      }
    );
    res.json(response.data);
  } catch (error: any) {
    handleError(error, res, 'Failed to fetch videos by category');
  }
});

// Get videos from a playlist
router.get('/playlistItems', async (req, res) => {
  const { playlistId, maxResults = '10' } = req.query;

  if (!playlistId || typeof playlistId !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing playlistId parameter.' });
  }

  try {
    const response = await makeYoutubeRequest(
      'https://www.googleapis.com/youtube/v3/playlistItems',
      {
        playlistId,
        part: 'snippet,contentDetails',
        maxResults: Number(maxResults)
      }
    );
    res.json(response.data);
  } catch (error: any) {
    handleError(error, res, 'Failed to fetch playlist items');
  }
});

// Search videos
router.get('/search', async (req, res) => {
  const { query, channelId, maxResults = '10', publishedBefore, type = 'video' } = req.query;

  try {
    const response = await makeYoutubeRequest(
      'https://www.googleapis.com/youtube/v3/search',
      {
        q: query,
        channelId,
        part: 'snippet',
        type,
        maxResults: Number(maxResults),
        publishedBefore,
        order: 'date'
      }
    );
    res.json(response.data);
  } catch (error: any) {
    handleError(error, res, 'Failed to search videos');
  }
});

// Error handler helper function
function handleError(error: any, res: express.Response, defaultMessage: string) {
  let message = defaultMessage;
  if (axios.isAxiosError(error)) {
    console.error('YouTube API Error Response:', JSON.stringify(error.response?.data, null, 2));
    message = error.response?.data?.error?.message || error.message;
  }
  console.error(`${defaultMessage}:`, message);
  res.status(500).json({ error: message });
}

export default router;