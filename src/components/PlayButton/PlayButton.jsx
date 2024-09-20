import { MutedIcon, PauseIcon, PlayIcon, PlayingIcon, PlayNextIcon, PlayPreviousIcon, VolumeIcon } from '../icons';
import './PlayButton.css';

export const PlayPlayerButtonContainer = ({ children, onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-player-button">
      {children}
    </div>
  </div>
);

export const PlayLineButtonContainer = ({ children, onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-line-button">
      {children}
    </div>
  </div>
);


export const PlayButton = ({ PlayButtonContainer, play, pause, track, isPaused }) => {
  const handleClick = () => {
    if (isPaused) {
      play(track);
    } else {
      pause();
    }
  }

  return (
    <PlayButtonContainer onClick={handleClick}>
      {isPaused ? <PlayIcon /> : <PauseIcon />}
    </PlayButtonContainer>
  );
};  

export const PlayingButton = () => (
  <div className="play-button-container">
    <div className="play-line-button">
      <PlayingIcon />
    </div>
  </div>
);

export const PlayNext = ({ onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-player-button">
      <PlayNextIcon />
    </div>
  </div>
);

export const PlayPrevious = ({ onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-player-button">
      <PlayPreviousIcon />
    </div>
  </div>
);


export const VolumeButton = ({ mute, unmute, isMuted }) => {
  const handleClick = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  }

  return (
    <div className="play-button-container" onClick={handleClick}>
      <div className="play-player-button">
        {isMuted ? <MutedIcon /> : <VolumeIcon />}
      </div>
    </div>
  )}
;

export default PlayButton;
