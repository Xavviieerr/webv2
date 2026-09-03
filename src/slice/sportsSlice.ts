import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { FootballLeagueItem } from "./footballLeaguesSlice";

interface SportsState {
  leagues: FootballLeagueItem[];
}

const initialState: SportsState = {
  leagues: [],
};

export const sportsSlice = createSlice({
  name: "sports",
  initialState,
  reducers: {
    setFootballLeagues: (state, action: PayloadAction<FootballLeagueItem[]>) => {
      state.leagues = action.payload;
    },
    clearFootballLeagues: (state) => {
      state.leagues = [];
    },
  },
});

export const { setFootballLeagues, clearFootballLeagues } = sportsSlice.actions;
export default sportsSlice.reducer;
