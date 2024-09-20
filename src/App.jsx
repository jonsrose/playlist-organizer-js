// import WebPlayback from './Webplayback';
import './App.css';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import Login from './components/Login';
import Playlists from './components/Playlist/Playlists';
import Playlist from './components/Playlist/Playlist';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import useStore from './store/store';
import { getProfile, updatePlaylist, addItemsToPlaylist } from './services/api';
import { redirectUrl, tokenEndpoint, clientId, webBaseUrl } from './constants';
import Player from './components/Player/Player';
import { DragDropContext } from '@hello-pangea/dnd';
import { useMutation } from '@tanstack/react-query';
import NewPlaylistModal from './components/Playlist/NewPlaylistModal';
import SpotifyLink from './components/SpotifyLink';

const queryClient = new QueryClient();

const uninterceptedAxiosInstance = axios.create();

function App() {
    // console.log('rendering App');
    const currentPlaylist = useStore(state => state.currentPlaylist);
    const playlistId = currentPlaylist?.id;
    const accessToken = useStore((state) => state.accessToken);
    const _setAccessToken = useStore((state) => state.setAccessToken);
    const setUserId = useStore((state) => state.setUserId);
    const userId = useStore((state) => state.userId);
    const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState(false);
    const setTracks = useStore(state => state.setTracks);
    const tracks = useStore(state => state.tracks);
    const [showModal, setShowModal] = useState(false);
    const [modalPlaylistName, setModalPlaylistName] = useState('')
    const setCountryCode = useStore(state => state.setCountryCode);
    const setIsCamelotFormat = useStore(state => state.setIsCamelotFormat);
    const isCamelotFormat = useStore(state => state.isCamelotFormat);
    const [isDevModeModalOpen, setIsDevModeModalOpen] = useState(false);
    const [hasShownDevModeModal, setHasShownDevModeModal] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const hasSeenFtuxModal = useStore((state) => state.hasSeenFtuxModal);
    const setHasSeenFtuxModal = useStore((state) => state.setHasSeenFtuxModal);
    const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);

    const setAccessToken = (accessToken) => {
      _setAccessToken(accessToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      // localStorage.setItem('access_token', accessToken);
    }

    const setToken = (
      { access_token, refresh_token, expires_in } // Removed type annotations
    ) => {
      const now = new Date();
      const expiry = new Date(now.getTime() + (Number(expires_in) * 1000));
      setAccessToken(access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('expires_in', expires_in);
      localStorage.setItem('expires', expiry.toString());
    }
    
    async function logout() {
      localStorage.clear();
      setAccessToken('');
      delete axios.defaults.headers.common['Authorization'];
      window.location.href = redirectUrl;
    }

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error('axios error', error);
        if (error.response.status === 401) {
          try {
            const { access_token, refresh_token, expires_in } = await getRefreshToken();
            setToken({ access_token, refresh_token, expires_in });
          } catch (error) {
            console.error('Failed to refresh token:', error);
            logout();
          }
        } else if (error.response.status === 403) {
          if (!hasShownDevModeModal && error.response.data == 
            "Check settings on developer.spotify.com/dashboard, the user may not be registered."
          ) {
            setIsDevModeModalOpen(true);
          } else if (error.response.data?.error?.reason === 'PREMIUM_REQUIRED'){
            setIsPremiumModalOpen(true);
          } else {
            console.error('error', error.response.data);
          }
        }
        return Promise.reject(error);
      }
    );

    useEffect(() => {
      // console.log('useEffect setUserId');

      const fetchData = async () => {
        try {
          const data = await getProfile();
          // console.log('userProfile', { data });
          // console.log('set user id', data.id)
          setUserId(data.id);
        } catch (error) {
          console.error(error);
        }
      };

      if (accessToken && !userId) {
        fetchData();
      } 
    }, [setUserId, userId, accessToken]);

    const getRefreshToken = async () => {
      const refreshToken = localStorage.getItem('refresh_token');

      const { data } = await uninterceptedAxiosInstance.post(tokenEndpoint, 
        new URLSearchParams({
          client_id: clientId,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
        { 
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        },
      );
      return await data;
    };

    const getToken = async (code) => {
      const code_verifier = localStorage.getItem('code_verifier');
    
      const { data } = await axios.post(tokenEndpoint,
        new URLSearchParams({
          client_id: clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUrl,
          code_verifier: code_verifier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        },
      );
    
      return data;
    };

    if (accessToken) {
      //   // console.log('setting axios access token', accessToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }

    const args = new URLSearchParams(window.location.search);
    const code = args.get('code');

    // console.log('breaker breaker');

    if (code) {
      const fetchData = async () => {
        const { access_token, refresh_token, expires_in } = await getToken(code);
        setToken({ access_token, refresh_token, expires_in });
        const profile = await getProfile();
        // console.log('userProfile', { profile });
        setCountryCode(profile.country);
    
        // Remove code from URL so we can refresh correctly.
        const url = new URL(window.location.href);
        url.searchParams.delete("code");  
        const updatedUrl = url.search ? url.href : url.href.replace('?', '');
        window.history.replaceState({}, document.title, updatedUrl);  
      };

      fetchData();
    }

    const updatePlaylistMutation = useMutation({
      mutationFn: ({
        playlistId, 
        rangeStart, 
        insertBefore,
        rangeLength
      }) => {
        return updatePlaylist({ playlistId, rangeStart, insertBefore, rangeLength });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey:  ["playlist", playlistId] })
      },
    })

    const onDragEnd = async (result) => {
      // console.log('onDragEnd', result);
      const { source, destination } = result;
    
      // Dropped outside the list
      if (!destination) {
        return;
      }
    
      if (destination.droppableId.startsWith('playlists')) {
        const droppableId = destination.droppableId;
        // Handle logic for when an item is dropped on the playlists
        // ...
        // console.log('dropped on playlists', droppableId);

        const parts = droppableId.split(',');
        const playlistId = parts[1];
        const playlistName = parts[2];

        // console.log('playlistId', playlistId);

        const draggableParts = result.draggableId.split('-');
        const trackId = draggableParts[0];

        // todo should be mutation?
        addItemsToPlaylist({ 
          playlistId, 
          uris: [`spotify:track:${trackId}`] 
        }).then(() => {
          setModalPlaylistName(playlistName);
          setShowModal(true); 
        }).catch(() => {
          // console.error('Error adding track to playlist:', error);
        });
      } else if (destination.droppableId === 'playlist-items') {
        // console.log('dropped on playlist items');
        // Handle logic for when an item is dropped on the playlist
        const rangeStart = source.index;
        const insertBefore = destination.index;
        const rangeLength = 1;

        const newTracks = [...tracks]
        const [removed] = newTracks.splice(rangeStart, 1)
        newTracks.splice(insertBefore, 0, removed);
        setTracks(newTracks);

        updatePlaylistMutation.mutate({
          playlistId, 
          rangeStart, 
          insertBefore,
          rangeLength
        })
      }
    };

    return (
      <div className="bg-black text-white">
        <Helmet>
          <title>Playlist Organizer</title>
          <link rel="icon" href={`${webBaseUrl}favicon.ico`} sizes="16x16" />
        </Helmet>
        <div className="wrapper">
          <header className="flex items-center justify-between bg-gray-900">
            <div className="font-bold p-4 text-lg">
              Playlist Organizer <span className="text-sm text-gray-500 ml-2">(beta)</span>
            </div>
            <div className="p-4 text-sm flex items-center text-gray-500">
              for <SpotifyLink href="https://www.spotify.com" className='text-green-500'><img src={`${webBaseUrl}Spotify_Logo_RGB_Green.png`} className="w-24 h-auto inline-block ml-4"/></SpotifyLink>
            </div>
            {accessToken && (
              <>
                <div>
                  <input
                    type="checkbox"
                    id="camelotFormatCheckbox"
                    onChange={(e) => setIsCamelotFormat(e.target.checked)}
                    checked={isCamelotFormat}
                  />
                  <label htmlFor="camelotFormatCheckbox" className="m-2"><SpotifyLink href="https://mixedinkey.com/camelot-wheel">Camelot</SpotifyLink> Format</label>
                  <button
                    className="bg-green-700 hover:bg-green-800 text-white font-bold p-2 mx-2 rounded-lg"
                    onClick={() => setIsNewPlaylistModalOpen(true)}
                  >
                    Create Playlist
                  </button>

                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold p-2 mx-2 rounded-lg"
                    onClick={() => setIsHelpModalVisible(true)}
                  >
                    Help
                  </button>

                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 mx-2 rounded-lg"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </header>
          {accessToken ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <nav className="bg-gray-900">
                <Playlists />
              </nav>
              <main className="bg-gray-900">
                <Playlist />
              </main>
            </DragDropContext>
            ) : (
              <main className="bg-gray-900">
                <Login />
              </main>
            )}
         <footer className="flex justify-center bg-gray-900">
            {accessToken && <Player />}
          </footer>
        </div>
        <NewPlaylistModal isOpen={isNewPlaylistModalOpen} setIsOpen={setIsNewPlaylistModalOpen}/>
        {showModal && (
          <div className="text-black fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-5 rounded-md shadow-lg">
              <h2 className="text-m font-bold mb-4">Added to {modalPlaylistName}</h2>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
        {isDevModeModalOpen && !hasShownDevModeModal && (
          <div className="text-black fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-5 rounded-md shadow-lg">
              <h2 className="text-m font-bold mb-4">You do not have access to the app in development mode.</h2>
              <p className="mb-4">Please contact the developer to request access</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => {
                 setIsDevModeModalOpen(false);
                 setHasShownDevModeModal(true);
              }}>
                Close
              </button>
            </div>
          </div>  
        )}
        {isPremiumModalOpen && (
          <div className="text-black fixed inset-0 flex items-center justify-center bg-opacity-50">
            <div className="bg-white p-5 rounded-md shadow-lg">
              <h2 className="text-m font-bold mb-4">Premium Subscription Required</h2>
              <p className="mb-4">Premium Subscription Required for playback</p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700" onClick={() => {
                 setIsPremiumModalOpen(false);
              }}>
                Close
              </button>
            </div>
          </div>  
        )}
        {(!hasSeenFtuxModal || isHelpModalVisible) && !isDevModeModalOpen && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
              <div className="bg-white text-black max-w-screen-sm z-10 rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4 text-green-700">Welcome to Playlist Organizer!</h2>
                <p>This app is a complimentary app to the Spotify app. First, create playlists using the Spotify app, then use this app to optimize playlists or extract selected tracks to a new playlist. (Mobile not supported at this time.)</p>
                <h3 className='text-xl pt-4'>How to Use:</h3>
                <ul className="list-disc list-inside">
                  <li className='mt-2'>Click on a playlist to view its tracks</li>
                  <li className='mt-2'>View various attributes for each track as detected by Spotify (acuracy may vary!):
                    <ul className="list-disc list-inside pl-4">
                      <li>🎤 Vocality </li>
                      <li>🕺 Dance-ability</li>
                      <li>⚡️ Energy</li>
                      <li>🏎️ Tempo (BPM)</li>
                      <li>🐢 Half Tempo (BPM) - ocasionally, the detected tempo may be twice as high as the actual value. In such instances, utilize the half tempo value. </li>
                      <li>🗝️ Key - Choose between traditional and <SpotifyLink href="https://mixedinkey.com/camelot-wheel" target="_blank" className="font-bold">Camelot</SpotifyLink> format</li>
                      <li>⌛️ Duration</li>
                    </ul>
                  </li>
                  <li className='mt-2'>Drag and drop tracks to reorder them, using the attributes as a guide to create a flowing playlist</li>
                  <li className='mt-2'>Create new playlists</li>
                  <li className='mt-2'>Drag tracks to other playlists to add them</li>
                  <li className='mt-2'>Click on the play button to play the track</li>
                  <li className='mt-2'>Click on the pause button to pause the track</li>
                  <li className='mt-2'>Click on the next and previous buttons to navigate through playlist</li>
                </ul>
                <button className="bg-green-700 hover:bg-green-800 text-white font-bold p-2 mr-4 mt-4 rounded-lg" onClick={() => {
                  if (isHelpModalVisible) {
                    setIsHelpModalVisible(false);
                  }
                  if (!hasSeenFtuxModal) {
                    setHasSeenFtuxModal(true);
                  }
                }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

function AppContainer() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default AppContainer;

