import { useEffect, useRef, useState } from 'react';
import './Playlist.css';
import useStore from '../../store/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import useObserver from '../../hooks/useObserver';
import { getNextPageParam } from '../../utils'
import { Droppable } from '@hello-pangea/dnd';
import { getPlaylist, play, pause, playItem, playPlaylistTrack } from '../../services/api';

import PlaylistItem from './PlaylistItem';
import SpotifyLink from '../SpotifyLink';

function Playlist() {

  const currentPlaylist = useStore(state => state.currentPlaylist);
  const playlistId = currentPlaylist?.id;
  const accessToken = useStore(state => state.accessToken);
  const selectedTrack = useStore(state => state.selectedTrack);
  const setSelectedTrack = useStore(state => state.setSelectedTrack);
  const setSelectedIndex = useStore(state => state.setSelectedIndex);
  const countryCode = useStore(state => state.countryCode);
  const deviceId = useStore(state => state.deviceId);
  const loadMoreRef = useRef(null);
  // const queryClient = useQueryClient();
  const setTracks = useStore(state => state.setTracks);
  const setUriMap = useStore(state => state.setUriMap);
  const tracks = useStore(state => state.tracks);

  const [showMenu, setShowMenu] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const menuRef = useRef(null);

  const playlistRef = useRef(null);

  const { 
    data, 
    error, 
    fetchNextPage, 
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["playlist", playlistId],
    queryFn: getPlaylist(playlistId, countryCode),
    enabled: !!playlistId &&  !!accessToken,
    getNextPageParam,
    initialPageParam: 0
  });

  // console.log('render data?.pages[0]?.items', data?.pages[0]?.items);

  const flattenData = (data) => data ? data?.pages.flatMap(page => page.items) : [];

  useEffect(() => {
    // console.log('useEffect data?.pages[0]?.items', data?.pages[0]?.items);
    const tracks = flattenData(data);
    setTracks(tracks);
    
    const uriMap = tracks.reduce((acc, track) => {
      if (track.linkedFromUri) {
        acc[track.uri] = track.linkedFromUri;
      }
      return acc;
    }
    , {});
    // console.log('uriMap', uriMap);
    
    setUriMap(uriMap);
  }, [data, setTracks, setUriMap])

  // const items = useMemo(() => (data ? data?.pages.flatMap(page => page.items) : []), [data]);
  // let flattenedItems = items;

  useEffect(() => {
    // console.log('selectedTrack', selectedTrack);
  }, [selectedTrack]);

  useObserver(fetchNextPage, hasNextPage, loadMoreRef); 

  function handleClick(e, track, index) {
    e.preventDefault();
    setSelectedTrack(track);
    setSelectedIndex(index);
  }

  function handleRightClick(e, track, index) {
    e.preventDefault();
    setSelectedTrack(track);
    setSelectedIndex(index);
    setShowMenu(true);
    setX(e.clientX);
    setY(e.clientY);
  }

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) return null;

  if (error) return 'Error';

  if (!data) {
    return null;
  }

  const handlePlay = (track) => {
    // console.log('handlePlay', track.uri);
    play(deviceId, track.uri);
  };

  const handlePlayItem = (playlistId, index) => {
    // console.log('handlePlayItem', playlistId, index);
    playItem(deviceId, playlistId, index);
  }

  const handlePlayPlaylistTrack = (playlistId, trackUri) => {
    // console.log('handlePlayPlaylistTrack', playlistId, trackUri);
    playPlaylistTrack(deviceId, playlistId, trackUri);
  }

  const handlePause = () => {
    // console.log('pause');
    pause(deviceId);
  };
  
  // console.log('rendering playlist');

  if (!currentPlaylist) {
    return null;
  }

  return (
    <Droppable droppableId="playlist-items">
      {(provided) => (
        <div>
          <div className="bg-gray-900 text-xl pl-4 pt-4 text-gray-200">
            {currentPlaylist && <SpotifyLink href={currentPlaylist.external_urls.spotify}>{currentPlaylist.name}</SpotifyLink>}
          </div>
          <div className="item-grid item-grid-header bg-gray-900">
            <div className="item-grid-left">
              <div className="index text-gray-400">#</div>
              <div className="cover-art text-gray-400">Title</div>
              <div className="title"></div>                
            </div>
            <div className="item-grid-right">
              <div className="vocal" title="Vocal">🎤</div>
              <div className="dance" title="Danceability">🕺</div>
              <div className="energy" title="Energy">⚡️</div>
              <div className="tempo" title="Tempo">🏎️</div>
              <div className="halfTempo" title="Half Tempo: Tempo might be set to double its intended speed, so half tempo also included">🐢</div>
              <div className="key w-12" title="Key">🗝️</div>
              <div className="duration" title="Duration">⌛️</div>
            </div>
            <div className="spacer"></div>
          </div>

          {/* Wrap the playlist items in a div and allow it to scroll */}
          <ul 
            className="playlist-items bg-gray-900" 
            {...provided.droppableProps} 
            ref={(ref) => {
              provided.innerRef(ref);
              playlistRef.current = ref;
            }}
          >
            {tracks.map(
              (track, index) => (
                <PlaylistItem
                  playlistRef={playlistRef} 
                  key={`${track.id}-${index}`}
                  track={track}
                  playlistId={playlistId}
                  selectedTrack={selectedTrack}
                  index={index}
                  play={handlePlay}
                  playItem={handlePlayItem}
                  playPlaylistTrack={handlePlayPlaylistTrack}
                  pause={handlePause}
                  handleRightClick={handleRightClick}
                  handleClick={handleClick}
                  showMenu={showMenu}
                  menuRef={menuRef}
                  x={x}
                  y={y}
                  setShowMenu={setShowMenu}
                />
              )
            )}
            {provided.placeholder}
            <div ref={loadMoreRef} />
          </ul>
        </div>
      )}
    </Droppable>
  );
}
export default Playlist;
