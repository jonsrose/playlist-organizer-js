import { useEffect, useRef, useState } from 'react';
import useStore from '../../store/store';
import { playPlaylistTrack } from '../../services/api';
import PlayButton, { PlayNext, PlayPlayerButtonContainer, PlayPrevious, VolumeButton } from '../PlayButton/PlayButton';
import { play, pause } from '../../services/api';
import './Player.css'
import { formatDuration } from '../../utils';
import { getTrackUrl, getArtistUrlFromUri } from '../../utils';
import SpotifyLink from '../SpotifyLink';

const Player = () => {
  // const [isPaused, setIsPaused] = useState(true);
  const [isActive, setActive] = useState(false);
  const accessToken = useStore((state) => state.accessToken);
  const setDeviceId = useStore((state) => state.setDeviceId);
  const deviceId = useStore((state) => state.deviceId);
  const isPaused = useStore((state) => state.isPaused);
  const setIsPaused = useStore((state) => state.setIsPaused);
  const currentPosition = useStore((state) => state.currentPosition);
  const setCurrentPosition = useStore((state) => state.setCurrentPosition);
  const playerRef = useRef(null);
  const setPlayingTrack = useStore((state) => state.setPlayingTrack);
  const track = useStore((state) => state.playingTrack);
  const [volume, setVolume] = useState(0.5);
  const [mutedVolume, setMutedVolume] = useState(0.0);
  const playlistId = useStore((state) => state.playlistId);
  const uriMap = useStore((state) => state.uriMap);

  const isMuted = volume === 0;

  // console.log('isMuted', isMuted);

  // console.log('isActive', isActive);

  const handlePlay = () => {
    // console.log('play');
    if (isActive) {
      play(deviceId);
    } else if (track) {
      // console.log('playPlaylistTrack', { playlistId, track });
      const { uri } = track;
      const linkedFromUri = uriMap[uri];
      // console.log({ linkedFromUri, uri });
      const playUri = linkedFromUri ? linkedFromUri : uri;
      playPlaylistTrack(deviceId, playlistId, playUri)
    }
  };

  const handlePause = () => {
    // console.log('pause');
    pause(deviceId);
  };

  const playNext = () => {
    if (playerRef.current && playerRef.current.nextTrack) {
      playerRef.current.nextTrack().then(() => {
        // console.log('Skipped to next track!');
      });
    }    
  };

  const playPrevious = () => {
    if (playerRef.current && playerRef.current.previousTrack) {
      playerRef.current.previousTrack().then(() => {
        // console.log('Skipped to previous track!');
      });
    }    
  };

  const handleProgressChange = (event) => {
    const newPosition = event.target.value;
  
    // Update the current position in the UI
    setCurrentPosition(newPosition);
  
    // Seek to the new position in the player
    if (playerRef.current && playerRef.current.seek) {
      playerRef.current.seek(newPosition).then(() => {
        // console.log(`Changed position to ${newPosition}`);
      });
    }
  };

  const resetPlayer = (playerRef) => {
    if (playerRef && playerRef.current && playerRef.current.disconnect) {
      const player = playerRef.current;
      if (player.removeEventListener) {
        player.removeEventListener('ready');
        player.removeEventListener('not_ready');
        player.removeEventListener('player_state_changed');
      }
      if (player.disconnect) {
        player.disconnect();
      }
    }
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {

      // console.log('onSpotifyWebPlaybackSDKReady');
      resetPlayer(playerRef);
      
      const player = new window.Spotify.Player({
        name: 'Playlist Organizer',
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      playerRef.current = player;

      player.addListener('ready', ({ device_id }) => {
        setDeviceId(device_id);
        // console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', () => {
        // console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        // console.log('player_state_changed', state);
        if (!state) {
          setActive(false);
          return;
        }

        // console.log({ state});
        // console.log()
        // console.log({ playingTrack: state.track_window.current_track });
        setPlayingTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        // console.log(`position ${state.position}`);
        setCurrentPosition(state.position);
        setActive(true);


        // player.getCurrentState().then((state) => {
        //   !state ?  : 
        // });
      });
      
      player.connect();   

      return () => {
        resetPlayer(playerRef);
        document.body.removeChild(script);
      };
    };
  }, [accessToken, setDeviceId, setIsPaused, setCurrentPosition, setPlayingTrack]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentState) {
        playerRef.current.getCurrentState().then(state => {
          if (state) {
            setCurrentPosition(state.position);
          }
        });
      }
    }, 1000); // Update every second
  
    // Clear the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [setCurrentPosition]); // Re-run the effect when the player changes

  function mute() {
    // console.log('mute before volume', volume)
    setMutedVolume(volume);
    setPlayerVolume(0.0);
  }

  function unmute() {
    // console.log('unmute before volume', volume)
    setPlayerVolume(mutedVolume);
    // setPlayerVolume(0.5);
    // setMutedVolume(0);
  }

  const setPlayerVolume = (volume) => {
    // console.log('setPlayerVolume', volume);
    setVolume(volume);
    if (playerRef.current && playerRef.current.setVolume) {
      playerRef.current.setVolume(volume).then(() => {
        // console.log(`Changed volume to ${volume}`);
      });
    }
  }


  // console.log('rendering volume', volume);

  if (!track) {
    return null;
  }

  return (
    <div className="player w-full h-full">
      <div className="now-playing">
        <div className="cover-art" style={{
            backgroundImage: `url(${track?.album?.images[0]?.url})`,
          }} 
        />
        <div className="title truncate text-sm">
          <div><SpotifyLink href={getTrackUrl(track.id)}>{track.name}</SpotifyLink></div>
          <div className='text-xs text-gray-400'>
            {track.artists && track.artists.map((artist, index) => (
              <span key={`${artist.id}-${index}`}>
                <SpotifyLink href={getArtistUrlFromUri(artist.uri)}>{artist.name}</SpotifyLink>
                {index < track.artists.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </div>  
      </div>
      <div className="control-bar flex flex-col justify-center items-center pl-8 pr-8">
        <div className="flex">
          <PlayPrevious onClick={playPrevious} />
          <PlayButton PlayButtonContainer={PlayPlayerButtonContainer} isPaused={isPaused} play={handlePlay} playingTrack={null} pause={handlePause} />
          <PlayNext onClick={playNext} />
        </div>
        {track && track.duration_ms && (
          <div className="flex w-full items-center justify-center">
            <div className='mr-2'>{formatDuration(currentPosition)}</div>
            <input
              type="range"
              className="w-full max-w-xl"
              value={currentPosition}
              max={track.duration_ms}
              onChange={handleProgressChange} // Add a handler to update the current position when the user drags the thumb
            />
            <div className='ml-2'>{formatDuration(track.duration_ms)}</div>
          </div>
        )}
      </div>
      <div className="volume flex justify-center items-center pr-2">
        <VolumeButton mute={mute} unmute={unmute} isMuted={isMuted} />
        <input
          type="range" 
          className="w-full" 
          value={volume}
          min={0} 
          max={1}
          step={0.01}
          onChange={(event) => {
            // console.log('event.target.value', event.target.value);
            return setPlayerVolume(parseFloat(event.target.value));
          }}
        />
      </div>
    </div>
  );
};

export default Player;
