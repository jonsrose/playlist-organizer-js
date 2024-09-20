import PlayButton, { PlayLineButtonContainer, PlayingButton } from "../PlayButton/PlayButton";
import useStore from "../../store/store";

const IndexComponent = ({
  isHovered,
  isPaused,
  isPlaying,
  track,
  playlistId,
  index,
  playPlaylistTrack,
  setPlayingTrack,
  pause,
}) => {
  const setUriLinkedFromUri = useStore((state) => state.setUriLinkedFromUri);
  return (
      <div className="index text-gray-400">
        {isHovered ? (
          <PlayButton 
            PlayButtonContainer={PlayLineButtonContainer} 
            isPaused={isPaused || !isPlaying} 
            track={track} 
            play={() => {
                const { linkedFromUri, uri } = track;
                // console.log({ linkedFromUri, uri });

                let playUri;

                if (linkedFromUri) {
                    playUri = linkedFromUri;
                    setUriLinkedFromUri(uri, linkedFromUri)
                } else {
                    playUri = uri;
                }

                // console.log('play', { playlistId, track });
                playPlaylistTrack(playlistId, playUri)
                setPlayingTrack(track);
            }} 
            pause={pause}  
          />
        ) : isPlaying ? (
          <PlayingButton />
        ) : (
          <>{index + 1}</>
        )}
      </div>
  );
};

export default IndexComponent;