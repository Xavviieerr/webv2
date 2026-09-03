import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser, AuthState } from "@/features/auth/types";

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  stayLoggedIn: false,
  submissionStarted: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setAuthData: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        stayLoggedIn?: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      state.stayLoggedIn = !!action.payload.stayLoggedIn;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.submissionStarted = false;
      state.error = null;
      state.stayLoggedIn = false;
    },
    updateSubmissionState: (state, action: PayloadAction<boolean>) => {
      state.submissionStarted = action.payload;
    },
    restoreAuth: (
      state,
      action: PayloadAction<{
        token: string;
        refreshToken: string;
        user: AuthUser;
        stayLoggedIn: boolean;
      }>,
    ) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.stayLoggedIn = action.payload.stayLoggedIn;
    },
  },
});

export const {
  setUser,
  updateUser,
  setAuthData,
  logout,
  updateSubmissionState,
  restoreAuth,
} = authSlice.actions;

export type { AuthUser } from "@/features/auth/types";
export default authSlice.reducer;
