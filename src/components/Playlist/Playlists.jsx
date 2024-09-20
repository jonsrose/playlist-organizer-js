import React, { useRef } from 'react';
import useStore from '../../store/store';
import { useInfiniteQuery } from '@tanstack/react-query';
import useObserver from '../../hooks/useObserver';
import { getNextPageParam } from '../../utils'
import { getPlaylists } from '../../services/api';
import { Droppable } from '@hello-pangea/dnd';

function Playlists() {
  const setCurrentPlaylist = useStore(state => state.setCurrentPlaylist)
  const setSelectedTrack = useStore(state => state.setSelectedTrack)
  const currentPlaylist = useStore(state => state.currentPlaylist)
  const accessToken = useStore(state => state.accessToken);
  const loadMoreRef = useRef(null);

  const { 
    data, 
    error, 
    fetchNextPage, 
    hasNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['myPlaylists'],
    queryFn: getPlaylists,
    enabled: !!accessToken,
    getNextPageParam,
    initialPageParam: 0
  });
  
  useObserver(fetchNextPage, hasNextPage, loadMoreRef); 

  if (isLoading) return null;

  if (error) {
    return "Error ..."
  }

  if (!data) {
    return null;
  }

  console.log({ currentPlaylist});

  return (
    <ul>
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.items.map(
            (playlist, j) => {
              const isCurrent = playlist === currentPlaylist;

              return (
                <Droppable droppableId={`playlists,${playlist.id},${playlist.name}`} key={`${playlist.id}-${i}-${j}`}>
                  {(provided, snapshot) => (
                    <li 
                      className={
                        `px-4 py-2 flex items-center cursor-pointer border-2
                        ${snapshot.isDraggingOver ? 'border-green-500 ' : 'border-transparent'}
                        ${isCurrent ? 'bg-gray-700 hover:bg-gray-700' : 'hover:bg-gray-800'}`} 
                      onClick={() => {setCurrentPlaylist(playlist), setSelectedTrack(null)}}
                      {...provided.droppableProps} 
                      ref={provided.innerRef}
                    >
                      <div
                        style={playlist?.images?.[0]?.url ? {
                          backgroundImage: `url(${playlist?.images[0]?.url})`,
                        } : {}}
                        className="bg-cover mr-3 basis-12 h-12 rounded-md shrink-0"
                      ></div>
                      <div className='truncate'>{playlist.name}</div>
                      <div style={{ height: '0px', width: '0px' }}>{provided.placeholder}</div>
                    </li>
                  )}
                </Droppable>
              );
            }
          )}
        </React.Fragment>
      ))}
      <div ref={loadMoreRef} />
    </ul>
  );
}

export default Playlists;
