import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import createEventReducer from './slices/create-event.slice';
import eventDetailReducer from './slices/event-detail.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    createEvent: createEventReducer,
    eventDetail: eventDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
