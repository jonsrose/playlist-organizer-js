import axios from 'axios';
import { getCamelotKey, getKeyName } from '../utils';

export const getProfile = async () => {
  const { data } = await axios.get('https://api.spotify.com/v1/me');
  return data;
}

export const getPlaylists = async ({ pageParam }) => {
  const { data } = await axios.get(
    "https://api.spotify.com/v1/me/playlists", {
      params: {
        offset: pageParam
      },
    }
  )
  return data;
};

export const getPlaylist = (playlistId, market) => async ({ pageParam }) => {
  const { data } = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      params: {
        fields: 'offset,limit,total,items(track(name,id,uri,external_urls(spotify),linked_from(id,uri),album(images.url),artists(name,external_urls(spotify))))',
        offset: pageParam,
        market
      }
    }
  )

  if (data.items.length === 0) {
    const result = {
      limit: data.limit,
      offset: data.offset,
      total: data.total,
      items: data.items
    }
  
    return result;   
  } else {
    const ids = data.items.map((item) => item.track.id).join(',');
    // console.log('ids', ids);

    const { data: trackData } = await axios.get(
      'https://api.spotify.com/v1/audio-features', {
        params: {
          'ids': ids
        }
      }
    );

    // console.log('audio_features', trackData.audio_features);

    const featuresMap = trackData.audio_features.reduce(
      (
        acc,
        curr
      ) => ({
        ...acc, 
        [curr.id]: {
          ...curr,
          halfTempo: curr.tempo / 2,
          keyName: getKeyName(curr.key, curr.mode),
          camelotKey: getCamelotKey(curr.key, curr.mode)
        }
      }),
      {}
    ); 

    // console.log('featuresMap', featuresMap);

    const items = data.items.map((
      item
      ) => ({
      id: item.track.id,
      uri: item.track.uri,
      name: item.track.name,
      imageUrl: item?.track?.album?.images[0]?.url,
      linkedFromId: item.track.linked_from?.id,
      linkedFromUri: item.track.linked_from?.uri,
      artists: item.track.artists.map((artist) => ({ name: artist.name, spotifyUrl: artist.external_urls.spotify })),
      spotifyUrl: item.track.external_urls.spotify,
      ...featuresMap[item.track.id]
    }));

    // console.log('items', items);

    const result = {
      limit: data.limit,
      offset: data.offset,
      total: data.total,
      items
    }

    // console.log(result);

    return result;
  }
};

export const updatePlaylist = async ({
  playlistId,
  rangeStart,
  insertBefore,
  rangeLength
}) => {
  try {
    await axios.put(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, 
      {
        "range_start": rangeStart,
        "insert_before": insertBefore,
        "range_length": rangeLength
      }
    );
    // console.log(response.data);
  } catch (error) {
    // console.error(error);
  }
};

export const addItemsToPlaylist = async ({
  playlistId, 
  position = null,
  uris,
}) => {
  try {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, 
      {
        "uris": uris,
        "position": position,
      }
    );
    // console.log(response.data);
  } catch (error) {
    // console.error(error);
  }
};


export const deleteTrackFromPlaylist = async ({
  playlistId,
  trackId,
  position,
}) => {
  try {
    const response = await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`, 
      {
        data: {
          tracks:  [
            { 
              uri: `spotify:track:${trackId}`,
              positions: [position]
            }
          ]
        }
      }
    );
    // console.log(response.data);
    return response
  } catch (error) {
    // console.error(error);
  }
}

export const createPlaylist = async (userId, data) => {
  const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, data);
  return response.data;
};

// export const getDevices = async () => {
//   try {
//       const url = 'https://api.spotify.com/v1/me/player/devices';
//       const response = await axios.get(url);

//       // Process the device data as needed
//       // console.log('Available devices:', response.data.devices);
//   } catch (error) {
//       // console.log(error);
//   }
// };

export const getQueue = async () => {
  try {
      const url = 'https://api.spotify.com/v1/me/player/queue'
      await axios.get(url);
      // Process the queue data as needed
      // console.log('User queue:', response.data);
  } catch (error) {
      // console.log(error);
  }
};

// export const addTracksToQueue = async (deviceId, trackUris) => {
//   try {
//       const url = `https://api.spotify.com/v1/me/player/queue?device_id=${deviceId}`;
//       await axios.post(url, null, {
//         params: {
//             uri: trackUris.join(','), // Comma-separated list of track URIs
//         },
//       });

//       // console.log('New tracks added to queue successfully.');
//   } catch (error) {
//       // console.log(error);
//   }
// };

export const addTrackToQueue = async (deviceId, trackUri) => {
  try {
    const url = `https://api.spotify.com/v1/me/player/queue?device_id=${deviceId}&uri=${trackUri}`;
    await axios.post(url);

    // console.log('Track added to queue successfully.');
  } catch (error) {
    // console.log(error);
  }
};

export async function playPlaylist(deviceId, playlistUri) {
  try {
      const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
      const data = {
          context_uri: playlistUri,
      };

      await axios.put(url, data);

      // console.log('Playback started for the playlist.');
  } catch (error) {
      // console.error('Error starting playback:', error.message);
  }
}

export async function play(deviceId, trackUri = null) {
  try {
      const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
      const data = trackUri ? {
          uris: [trackUri], // Pass the track URI as an array
      }: null;

      await axios.put(url, data);

      // console.log('Track playback started.');
  } catch (error) {
      // console.error('Error starting track playback:', error.message);
  }
}

export async function playItem(deviceId, playlistId, position) {
  try {
      const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
      const data = {
        context_uri: `spotify:playlist:${playlistId}`,
        offset: {
          position // Replace with the position of the track you want to start playing
        }
      };

      await axios.put(url, data);

      // console.log('Playback started for the playlist.');
  } catch (error) {
      // console.error('Error starting playback:', error.message);
  }
}

export async function playPlaylistTrack(deviceId, playlistId, trackUri) {
  try {
      const url = `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`;
      const data = {
        context_uri: `spotify:playlist:${playlistId}`,
        offset: {
          uri: trackUri,
        }
      };

      await axios.put(url, data);

      // console.log('Playback started for the playlist.');
  } catch (error) {
      // console.error('Error starting playback:', error.message);
  }
}

export async function pause(deviceId) {
  try {
      const url = `https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`;
      await axios.put(url);

      // console.log('Playback paused.');
  } catch (error) {
      // console.error('Error pausing playback:', error.message);
  }
}

export async function getPlayerState() {
  try {
      const url = 'https://api.spotify.com/v1/me/player';
      await axios.get(url);

      // console.log('Player state:', response.data);
  } catch (error) {
      // console.error('Error getting player state:', error.message);
  }
}