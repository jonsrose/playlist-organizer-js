import { SPOTIFY_WEB_BASE_URL } from "./constants";

export const getNextPageParam = (page) => {
  const { offset, limit, total } = page;
  if (offset + limit < total) {
    return offset + limit;
  }
  return undefined;
};

export function getKeyName(key, mode) {
  const keys = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const index = (key + 12) % 12;
  const keyName = keys[index];
  const modeName = mode === 0 ? 'm' : '';
  return `${keyName}${modeName}`;
}

export function getCamelotKey(key, mode) {
  const keys = ['8B', '3B', '10B', '5B', '12B', '7B', '2B', '9B', '4B', '11B', '6B', '1B', 
                '5A', '12A', '7A', '2A', '9A', '4A', '11A', '6A', '1A', '8A', '3A', '10A', ];
  const index = key % 12 + (mode === 0 ? 12 : 0);
  return keys[index];
}

export const formatDuration = (duration_ms) => {
  const minutes = Math.floor(duration_ms / 60000);
  const seconds = ((duration_ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? '0' : '') + seconds;
}

export const getBgColorForKey = (key) => {
  const colors = {
    "1B": "#FF0000",
    "2B": "#FF7F00",
    "3B": "#FFFF00",
    "4B": "#80FF00",
    "5B": "#00FF00",
    "6B": "#00FF80",
    "7B": "#00FFFF",
    "8B": "#0080FF",
    "9B": "#0000FF",
    "10B": "#7F00FF",
    "11B": "#FF00FF",
    "12B": "#FF007F",
    "1A": "#FF3F3F",
    "2A": "#FF9F3F",
    "3A": "#FFFF3F",
    "4A": "#9FFF3F",
    "5A": "#3FFF3F",
    "6A": "#3FFF9F",
    "7A": "#3FFFFF",
    "8A": "#3F9FFF",
    "9A": "#3F3FFF",
    "10A": "#9F3FFF",
    "11A": "#FF3FFF",
    "12A": "#FF3F9F",
  };

  return colors[key] || "#FFFFFF"; // Default to white if key is not found
};

export function getContrast(hexColor){
  if (hexColor.slice(0, 1) === '#') {
    hexColor = hexColor.slice(1);
  }
  if (hexColor.length === 3) {
    hexColor = hexColor.split('').map(function (hex) {
      return hex + hex;
    }).join('');
  }
  const r = parseInt(hexColor.substr(0,2),16);
  const g = parseInt(hexColor.substr(2,2),16);
  const b = parseInt(hexColor.substr(4,2),16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';
}

export function getTempoColor(tempo) {
  if (tempo < 100) {
    return '#00FF00'; // Green for tempo less than 100
  } else if (tempo < 130) {
    return '#FFFF00'; // Yellow for tempo between 100 and 130
  } else {
    return '#FF0000'; // Red for tempo greater than 130
  }
}

export const getTrackUrl = (trackId) => {
  return `${SPOTIFY_WEB_BASE_URL}/track/${trackId}`;
}

const getArtistUrl = (artistId) => {
  return `${SPOTIFY_WEB_BASE_URL}/artist/${artistId}`;
}

export const getArtistUrlFromUri = (artistUri) => {
  if (!artistUri) {
    return '';
  }

  const artistId = artistUri.split(':')[2];
  return getArtistUrl(artistId);
}