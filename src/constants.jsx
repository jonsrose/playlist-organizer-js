export const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const webBaseUrl = import.meta.env.VITE_WEB_BASE_URL;
export const tokenEndpoint = "https://accounts.spotify.com/api/token"
export const authorizationEndpoint = "https://accounts.spotify.com/authorize"
export const redirectUrl = import.meta.env.VITE_WEB_BASE_URL;
export const scope = 'streaming user-read-email user-read-private playlist-modify-public playlist-modify-private user-read-currently-playing user-read-playback-state user-modify-playback-state'
export const SPOTIFY_WEB_BASE_URL = 'https://open.spotify.com';