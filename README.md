# Spotify Web Client

This app allows you to access playlists in your Spotify library and view various attributes for each track, such as the camelot key and tempo. With this information, you can arrange the playlist tracks according to their tempo and key for a seamless listening experience. The app supports endless scroll and was built using React, Tanstack Query (formerly React Query), and Zustand libraries.

In order to arrange the playlist you can use drag and drop to move tracks around in the playlist. Also you can create playlists and add items from existing playlists other playlists.

To run this app, follow these steps:

1. Create an app on the [Spotify developer dashboard](https://developer.spotify.com/dashboard):
  - Click on the Create an App button and enter an App Name and App Description of your choice.
  - Click on Create and you will be redirected to the app overview page.
  - On the app overview page, you will see your Client ID under the name of your app. You do not need the Client Secret because the app uses PKCE authentication, which does not require a secret.

2. Create a `.env` file in the project root directory with the following properties:
```
# Spotify Client Id
VITE_SPOTIFY_CLIENT_ID=<Spotify Client Id>
# url of web app
VITE_WEB_BASE_URL=http://localhost:3000/playlist-organizer/ 
```
3. run web app start
```
npm run dev
```