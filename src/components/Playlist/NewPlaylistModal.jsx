import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useStore from '../../store/store';
import { createPlaylist } from '../../services/api';
import PropTypes from 'prop-types';

const NewPlaylistModal = ({ isOpen, setIsOpen }) => {
  const userId = useStore((state) => state.userId);
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const saveNewPlaylist = async ({ userId, playlistName }) => {
    // console.log('saveNewPlaylist', name);
    
    return  await createPlaylist(
      userId, 
      { name: playlistName }
    );
  };

  const createPlaylistMutation = useMutation({
    mutationFn: saveNewPlaylist,
    onSuccess: ()  => {
      // console.log('createPlaylistMutation onSuccess');
      queryClient.invalidateQueries({ queryKey:  ["myPlaylists"] })
      setIsOpen(false);
    },
  });

  const handleSave = async () => {
    if (inputRef.current) {
      const playlistName = inputRef.current.value;
      createPlaylistMutation.mutate ({ userId, playlistName });

      // setIsOpen(false)

      // queryClient.setQueryData(["myPlaylists"], (old) => {
      //   // why does the following line cause this error: Spread types may only be created from object types.ts(2698) (parameter) old: unknown
      //   const newData = {...old};

      //   newData.pages[0].items = [newPlaylist, ...newData.pages[0].items]
      //   return newData;
      // });
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            <div className="max-w-screen-sm z-10 rounded-lg p-8 bg-gray-800">
              <h2 className="text-lg font-medium mb-4">Create Playlist</h2>
              <div className="mb-4">
                <label htmlFor="playlist-name" className="block text-white font-medium mb-2">Playlist Name</label>
                <input ref={inputRef} data-form-type="other" type="text" id="playlist-name" name="playlist-name" className="text-black w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-300 focus:shadow-outline-blue" />
              </div>              
              <button className="bg-red-700 hover:bg-red-800 text-white font-bold p-2 mr-4 rounded-lg" onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="bg-green-700 hover:bg-green-800 text-white font-bold p-2 rounded-lg" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

NewPlaylistModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default NewPlaylistModal;
