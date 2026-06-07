import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DescriptionBlock, EventPass, EventCoupon } from "@/components/organisms/create-event-form/types";

export interface CreateEventState {
  step: number;
  title: string;
  headerImage: string;
  startDate: string | undefined; // Store dates as ISO strings in Redux
  startTime: string;
  endDate: string | undefined;
  endTime: string;
  category: string;
  eventMode: "ONLINE" | "OFFLINE";
  onlineLink: string;
  offlineAddress: string;
  offlineMapLink: string;
  offlineLandmark: string;
  capacity: string;
  blocks: DescriptionBlock[];
  passes: EventPass[];
  coupons: EventCoupon[];
  acceptedMethods: string[];
  payoutMethod: "BANK" | "UPI";
  payoutUpiId: string;
  payoutBankName: string;
  payoutAccountName: string;
  payoutAccountNumber: string;
  payoutIfsc: string;
}

const initialState: CreateEventState = {
  step: 1,
  title: "",
  headerImage: "",
  startDate: undefined,
  startTime: "",
  endDate: undefined,
  endTime: "",
  category: "",
  eventMode: "ONLINE",
  onlineLink: "",
  offlineAddress: "",
  offlineMapLink: "",
  offlineLandmark: "",
  capacity: "",
  blocks: [
    {
      id: "1",
      type: "heading",
      content: "About This Event",
      level: "h2"
    },
    {
      id: "2",
      type: "paragraph",
      content: "Join us for an unforgettable experience...",
      textSize: "base"
    }
  ],
  passes: [
    {
      id: "1",
      pricing: "FREE",
      tier: "GA",
      customName: "",
      category: "SINGLE",
      quantity: "100",
      price: ""
    }
  ],
  coupons: [],
  acceptedMethods: ["RAZORPAY", "CHECKIN"],
  payoutMethod: "BANK",
  payoutUpiId: "",
  payoutBankName: "",
  payoutAccountName: "",
  payoutAccountNumber: "",
  payoutIfsc: "",
};

export const createEventSlice = createSlice({
  name: 'createEvent',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    updateField: <K extends keyof CreateEventState>(
      state: CreateEventState,
      action: PayloadAction<{ field: K; value: CreateEventState[K] }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
    setBlocks: (state, action: PayloadAction<DescriptionBlock[]>) => {
      state.blocks = action.payload;
    },
    setPasses: (state, action: PayloadAction<EventPass[]>) => {
      state.passes = action.payload;
    },
    setCoupons: (state, action: PayloadAction<EventCoupon[]>) => {
      state.coupons = action.payload;
    },
    setAcceptedMethods: (state, action: PayloadAction<string[]>) => {
      state.acceptedMethods = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  setStep,
  updateField,
  setBlocks,
  setPasses,
  setCoupons,
  setAcceptedMethods,
  resetForm,
} = createEventSlice.actions;

export default createEventSlice.reducer;
