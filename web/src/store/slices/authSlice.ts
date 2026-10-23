import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: Record<string, unknown> | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.isAuthenticated = true;
      state.isInitialized = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.user = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { login, logout, setInitialized } = authSlice.actions;
export default authSlice.reducer;
