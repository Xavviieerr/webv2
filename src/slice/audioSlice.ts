import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AudioState {
  /** URL of the audio currently playing, or null if none. */
  playingAudioUrl: string | null;
}

const initialState: AudioState = {
  playingAudioUrl: null,
};

const audioSlice = createSlice({
  name: "audio",
  initialState,
  reducers: {
    setPlayingAudio(state, action: PayloadAction<string | null>) {
      state.playingAudioUrl = action.payload;
    },
  },
});

export const { setPlayingAudio } = audioSlice.actions;
export default audioSlice.reducer;
