import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware'
// import zukeeper from 'zukeeper';

const useStore = create()(
  devtools(
    persist(
      (set) => ({
        accessToken: '',
        selectedTrack: null,
        selectedIndex: null,
        currentPlaylist: null,
        userId: '',
        deviceId: '',
        isPaused: true,
        playingTrack: null,
        currentPosition: 0,
        tracks: [],
        countryCode: '',
        isCamelotFormat: false,
        hasSeenFtuxModal: false,
        uriMap: {},
        setAccessToken: (token) => set(() => ({ accessToken: token })),
        setSelectedTrack: (track) => set(() => ({ selectedTrack: track })),
        setSelectedIndex: (index) => set(() => ({ selectedIndex: index })),
        setCurrentPlaylist: (playlist) => set(() => ({ currentPlaylist: playlist })),
        setUserId: (id) => set(() => ({ userId: id })),
        setDeviceId: (id) => set(() => ({ deviceId: id })),
        setIsPaused: (paused) => set(() => ({ isPaused: paused })),
        setPlayingTrack: (track) => set({ playingTrack: track }),
        setCurrentPosition: (position) => set({ currentPosition: position }),
        setTracks: (tracks) => set({ tracks }),
        setCountryCode: (code) => set({ countryCode: code }),
        setIsCamelotFormat: (isCamelotFormat) => set({ isCamelotFormat }),
        setHasSeenFtuxModal: (hasSeenFtuxModal) => set({ hasSeenFtuxModal }),
        setUriLinkedFromUri: (uri, linkedFromUri) => set((state) => ({ uriMap: { ...state.uriMap, [uri]: linkedFromUri } })),
        setUriMap: (uriMap) => set({ uriMap }),
      }),
      {
        name: 'storage',
        partialize: (state) => {
          // eslint-disable-next-line no-unused-vars
          const { isPaused, playingTrack, currentPlaylist, selectedTrack, ...rest } = state;
          return rest;
        },
      }
    )
  )
);

window.store = useStore;

export default useStore;