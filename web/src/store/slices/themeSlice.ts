import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@/gql/graphql';

export interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: 'LIGHT',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeState: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    toggleThemeState: (state) => {
      state.theme = state.theme === 'LIGHT' ? 'DARK' : 'LIGHT';
    },
  },
});

export const { setThemeState, toggleThemeState } = themeSlice.actions;
export default themeSlice.reducer;
