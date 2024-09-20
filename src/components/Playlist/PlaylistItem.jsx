import { useEffect, useRef, useState } from 'react';
import { Draggable } from '@hello-pangea/dnd'
import ContextModal from './ContextModal';
import useStore from '../../store/store';
import { formatDuration, getBgColorForKey, getTempoColor, getContrast } from '../../utils';
import Gauge from '../Gauge';
import IndexComponent from '../PlaylistItemIndex/PlaylistItemIndex';
import SpotifyLink from '../SpotifyLink';
import PropTypes from 'prop-types';

const PlaylistItem = (
  { 
    track, 
    index,
    playlistId, 
    selectedTrack, 
    playPlaylistTrack,
    pause, 
    handleRightClick, 
    handleClick, 
    showMenu, 
    menuRef, 
    x, 
    y, 
    setShowMenu,
    playlistRef,
  }
) => {
  const isCurrent = selectedTrack?.id === track.id;
  const key = `${track.id}-${index}`
  const isPaused = useStore((state) => state.isPaused);
  const [isHovered, setIsHovered] = useState(false);
  const { playingTrack, setPlayingTrack } = useStore();
  const isPlaying = playingTrack?.id === track.id && !isPaused;
  const isCamelotKey = useStore((state) => state.isCamelotFormat);

  const itemRef = useRef(null);

  useEffect(() => {
    if (isPlaying && itemRef.current) {
      const itemRect = itemRef.current.getBoundingClientRect();
      const containerRect = playlistRef.current?.getBoundingClientRect();

      const isVisible = 
        containerRect && itemRect.top >= containerRect.top &&
        itemRect.bottom <= containerRect.bottom;

      if (!isVisible) {
        itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [isPlaying, playlistRef]);
  
  return (
      <Draggable key={key} draggableId={key} index={index}>
        {(provided, snapshot) => (
          <li
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)} 
            onContextMenu={(e) => handleRightClick(e, track, index)}
            onClick={(e) => handleClick(e, track, index)}
            ref={(ref) => {
              provided.innerRef(ref);
              itemRef.current = ref;
            }}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={snapshot.isDragging ? 'dragging' : `item-grid py-2 ${isCurrent ? 'bg-gray-700 hover:bg-gray-700' : 'hover:bg-gray-800'}`}
          >
            {snapshot.isDragging ? (
              <div>{track.name}</div>
            ) : (
              <>
                {(showMenu) && (
                  <ContextModal menuRef={menuRef} x={x} y={y} setShowMenu={setShowMenu} />
                )}
                <div className="item-grid-left">
                  <IndexComponent 
                    isHovered={isHovered}
                    isPaused={isPaused}
                    isPlaying={isPlaying}
                    track={track}
                    playlistId={playlistId}
                    index={index}
                    playPlaylistTrack={playPlaylistTrack}
                    setPlayingTrack={setPlayingTrack}
                    pause={pause}
                  />
                  <div className="cover-art rounded-md" style={{
                      backgroundImage: `url(${track.imageUrl})`,
                    }} 
                  />
                  <div className="title truncate">
                    <div><SpotifyLink href={track.spotifyUrl}>{track.name}</SpotifyLink></div>
                    <div className='text-sm text-gray-400'>
                      {track.artists && track.artists.map((artist, index) => (
                        <span key={`${artist.id}-${index}`}>
                          <SpotifyLink href={artist.spotifyUrl}>{artist.name}</SpotifyLink>
                          {index < track.artists.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  </div>                
                </div>
                <div className="item-grid-right">
                  <Gauge className="vocal" radius={10} value={1.0 - track.instrumentalness} />
                  <Gauge className="dance" radius={10} value={track.danceability} />  
                  <Gauge className="energy" radius={10} value={track.energy} />
                  <div className="tempo" style={{ color: getTempoColor(track.tempo) }}>
                    {Math.round(track.tempo)}
                  </div>
                  <div className="halfTempo" style={{ color: getTempoColor(track.halfTempo) }}>
                    {Math.round(track.halfTempo)}
                  </div>
                  <div className="key rounded-md w-12 h-12" style={{ 
                    backgroundColor: getBgColorForKey(track.camelotKey),
                    color: getContrast(getBgColorForKey(track.camelotKey))
                  }}>
                    {isCamelotKey ? 
                      <SpotifyLink href="https://mixedinkey.com/camelot-wheel">{track.camelotKey}</SpotifyLink> : 
                      track.keyName
                    }
                  </div>
                  <div className="duration text-gray-400">{formatDuration(track.duration_ms)}</div>
                </div>
              </>
            )}
          </li>
        )}
      </Draggable>
  );
};

PlaylistItem.propTypes = {
  track: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  playlistId: PropTypes.string.isRequired,
  selectedTrack: PropTypes.object,
  playPlaylistTrack: PropTypes.func,
  pause: PropTypes.bool,
  handleRightClick: PropTypes.func,
  handleClick: PropTypes.func,
  showMenu: PropTypes.bool,
  menuRef: PropTypes.object,
  x: PropTypes.number,
  y: PropTypes.number,
  setShowMenu: PropTypes.func,
  playlistRef: PropTypes.object,
};

export default PlaylistItem;
