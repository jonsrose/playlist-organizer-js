import { MutedIcon, PauseIcon, PlayIcon, PlayingIcon, PlayNextIcon, PlayPreviousIcon, VolumeIcon } from '../icons';
import './PlayButton.css';
import PropTypes from 'prop-types';

export const PlayPlayerButtonContainer = ({ children, onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-player-button">
      {children}
    </div>
  </div>
);

PlayPlayerButtonContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

export const PlayLineButtonContainer = ({ children, onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-line-button">
      {children}
    </div>
  </div>
);

PlayLineButtonContainer.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

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

PlayButton.propTypes = {
  PlayButtonContainer: PropTypes.elementType.isRequired,
  play: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  track: PropTypes.object.isRequired,
  isPaused: PropTypes.bool.isRequired,
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

PlayNext.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export const PlayPrevious = ({ onClick }) => (
  <div className="play-button-container" onClick={onClick}>
    <div className="play-player-button">
      <PlayPreviousIcon />
    </div>
  </div>
);

PlayPrevious.propTypes = {
  onClick: PropTypes.func.isRequired,
};

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

VolumeButton.propTypes = {
  mute: PropTypes.func.isRequired,
  unmute: PropTypes.func.isRequired,
  isMuted: PropTypes.bool.isRequired,
};

export default PlayButton;
