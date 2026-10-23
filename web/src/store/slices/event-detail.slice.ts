import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventPass {
  id: string;
  pricing: string;
  tier: string;
  customName: string | null;
  passCategory: string | null;
  quantity: number | null;
  price: number;
}

export interface EventDetailState {
  id: string;
  slug?: string;
  title: string;
  image: string;
  date: string;
  time: string;
  tag: string;
  price: string;
  location: string;
  description?: string;
  passes?: EventPass[];
}

interface EventDetailSliceState {
  currentEvent: EventDetailState | null;
}

const initialState: EventDetailSliceState = {
  currentEvent: null,
};

const eventDetailSlice = createSlice({
  name: 'eventDetail',
  initialState,
  reducers: {
    setEventDetail: (state, action: PayloadAction<EventDetailState>) => {
      state.currentEvent = action.payload;
    },
    clearEventDetail: (state) => {
      state.currentEvent = null;
    },
  },
});

export const { setEventDetail, clearEventDetail } = eventDetailSlice.actions;
export default eventDetailSlice.reducer;
