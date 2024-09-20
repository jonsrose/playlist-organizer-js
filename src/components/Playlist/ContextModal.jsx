import React, { useRef, useState } from 'react';
import useStore from '../../store/store';
import { QueryClient, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import useObserver from '../../hooks/useObserver';
import { getNextPageParam } from '../../utils'
import { addItemsToPlaylist, getPlaylists, deleteTrackFromPlaylist } from '../../services/api';

function ContextModal({ 
  menuRef,
  x,
  y,
  setShowMenu,
 }) {

  const accessToken = useStore(state => state.accessToken);
  const selectedTrack = useStore(state => state.selectedTrack);
  const selectedIndex = useStore(state => state.selectedIndex);
  const loadMoreRef = useRef(null);
  const [isAddToPlaylistVisible, setIsAddToPlaylistVisible] = useState(false);
  const currentPlaylist = useStore(state => state.currentPlaylist);
  const queryClient = new QueryClient();
  const setTracks = useStore(state => state.setTracks);
  const tracks = useStore(state => state.tracks);

  const { 
    data, 
    fetchNextPage, 
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['myPlaylists'],
    queryFn: getPlaylists,
    enabled: !!accessToken,
    getNextPageParam,
    initialPageParam: 0
  });
  
  // console.log('pages[0].items', data?.pages[0]?.items);

  useObserver(fetchNextPage, hasNextPage, loadMoreRef);

  
  const addTrackToPlaylistMutation = useMutation({
    mutationFn: addItemsToPlaylist,
    onSuccess: (_, { playlistId })  => {
      // console.log('addTrackToPlaylistMutation onSuccess');
      queryClient.invalidateQueries({ queryKey:  ["playlist", playlistId] })
      setShowMenu(false);
    },
  });

  const addTrackToPlaylist = (playlistId, trackId) => {
    if (trackId === '') {
      // console.log('addTrackToPlaylist: no track id');
      return;
    }
    // console.log('adding track to playlist', playlistId, trackId);


    addTrackToPlaylistMutation.mutate({ playlistId, uris: [`spotify:track:${trackId}`] });
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTrackFromPlaylist,
    onSuccess: (_, { playlistId }) => {
      // console.log('deleteMutation onSuccess', currentPlaylistId);
      // console.log('deleteMutation onSuccess', playlistId);
      // const newTracks = tracks.filter(track => track.id !== trackId);
      // setTracks(newTracks);
  
      // Update the cache
      // queryClient.setQueryData(['playlist', playlistId], newTracks);
      queryClient.invalidateQueries({ queryKey:  ["playlist", playlistId] })
      setShowMenu(false);
    },
  });

  return (
    <div 
      ref={menuRef} 
      // className="flex flex-row justify-center items-center w-64 h-64 bg-gray-800 border-slate-500 border-2"
      className="flex" 
      style={{ position: 'absolute', left: x, top: y }}
    >
      <div className="options">
        <div
          className='add-to-playlist-option p-2 bg-gray-800'
          onMouseEnter={() => setIsAddToPlaylistVisible(true)} 
          
        >
          Add To Playlist
        </div> 
        <div 
          onClick={() => {
            if (selectedTrack?.id) {
              // console.log('deleting track', selectedTrack?.id, { selectedIndex, currentPlaylistId: currentPlaylist?.id });

              const newTracks = [...tracks];
              newTracks.splice(selectedIndex, 1);
              setTracks(newTracks);
              deleteMutation.mutate({ 
                playlistId: currentPlaylist?.id, 
                trackId: selectedTrack?.id ?? '',
                position: selectedIndex
              });
            }
          }}
          className='p-2 bg-gray-800'
          onMouseEnter={() => setIsAddToPlaylistVisible(false)} 
        >
          Remove from this playlist
        </div> 
      </div>
      <div 
        className={`add-to-playlist-container w-64 ${isAddToPlaylistVisible ? 'block' : 'hidden'} bg-gray-800`}
        onMouseEnter={() => setIsAddToPlaylistVisible(true)} 
      >
        <div className='text-xl'>Add to Playlist</div>
        
        <ul className='overflow-auto h-64'>
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.items.map(
                (playlist) => {
                  return (
                    <li 
                      key={playlist.id} 
                      className='truncate px-4 py-2 hover:bg-gray-800 cursor-pointer'
                      onClick={() => addTrackToPlaylist(playlist.id, selectedTrack?.id ?? '')}
                    >
                      {playlist.name}
                    </li>
                  );
                }
              )}
            </React.Fragment>
          ))}
          <div ref={loadMoreRef} />
        </ul>
      </div>
    </div>
  )
}

export default ContextModal;
