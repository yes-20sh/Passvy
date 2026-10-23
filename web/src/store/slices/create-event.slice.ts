import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DescriptionBlock,
  EventPass,
  EventCoupon,
} from '@/interfaces/events/event.interface';
import { PassCategory } from '@/types/events/event.type';
import { EventStep, CreateEventMutation } from '@/gql/graphql';

export interface CreateEventState {
  step: number;
  eventId: string | null;
  stepper: EventStep | null;
  lastSavedValues: Omit<CreateEventState, 'lastSavedValues' | 'step'> | null;

  title: string;
  headerImage: string;
  startDate: string | undefined;
  startTime: string;
  endDate: string | undefined;
  endTime: string;
  category: string;

  // Step 3: Event Mode
  eventMode: 'ONLINE' | 'OFFLINE';
  generateMeetLink: boolean;
  onlineLink: string;
  meetingStartDate?: string;
  meetingStartTime: string;
  meetingEndDate?: string;
  meetingEndTime: string;
  offlineAddress: string;
  offlineMapLink: string;
  offlineLandmark: string;
  city: string;
  state: string;
  country: string;
  capacity: string;
  blocks: DescriptionBlock[];
  passes: EventPass[];
  coupons: EventCoupon[];
  acceptedMethods: string[];
}

const initialState: CreateEventState = {
  step: 1,
  eventId: null,
  stepper: null,
  lastSavedValues: null,

  title: '',
  headerImage: '',
  startDate: undefined,
  startTime: '',
  endDate: undefined,
  endTime: '',
  category: '',

  // Step 3: Event Mode
  eventMode: 'ONLINE',
  generateMeetLink: false,
  onlineLink: '',
  meetingStartDate: undefined,
  meetingStartTime: '',
  meetingEndDate: undefined,
  meetingEndTime: '',
  offlineAddress: '',
  offlineMapLink: '',
  offlineLandmark: '',
  city: '',
  state: '',
  country: '',
  capacity: '',
  blocks: [
    {
      id: '1',
      type: 'HEADING',
      content: 'About This Event',
      level: 'h2',
    },
    {
      id: '2',
      type: 'PARAGRAPH',
      content: 'Join us for an unforgettable experience...',
      textSize: 'base',
    },
  ],
  passes: [
    {
      id: '1',
      pricing: 'FREE',
      tier: 'GA',
      customName: '',
      category: 'SINGLE',
      quantity: '',
      price: '',
    },
  ],
  coupons: [],
  acceptedMethods: [],
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
      action: PayloadAction<{ field: K; value: CreateEventState[K] }>,
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
    updateEventFromSaved: (
      state,
      action: PayloadAction<
        NonNullable<CreateEventMutation['createEvent']['event']>
      >,
    ) => {
      const event = action.payload;
      if (!event) return;

      state.eventId = event.id || null;
      state.stepper = event.stepper || null;

      state.title = event.title || '';
      state.headerImage = event.headerImage || '';
      state.startDate = event.startDate
        ? new Date(event.startDate as string).toISOString()
        : undefined;
      state.startTime = event.startTime || '';
      state.endDate = event.endDate
        ? new Date(event.endDate as string).toISOString()
        : undefined;
      state.endTime = event.endTime || '';
      state.category = event.category || '';

      if (event.mode) {
        state.eventMode = event.mode.eventMode as 'ONLINE' | 'OFFLINE';
        state.onlineLink = event.mode.onlineLink || '';
        state.meetingStartDate = event.mode.meetingStartDate
          ? new Date(event.mode.meetingStartDate as string).toISOString()
          : undefined;
        state.meetingStartTime = event.mode.meetingStartTime || '';
        state.meetingEndDate = event.mode.meetingEndDate
          ? new Date(event.mode.meetingEndDate as string).toISOString()
          : undefined;
        state.meetingEndTime = event.mode.meetingEndTime || '';
        state.offlineAddress = event.mode.offlineAddress || '';
        state.offlineMapLink = event.mode.offlineMapLink || '';
        state.offlineLandmark = event.mode.offlineLandmark || '';
        state.city = event.mode.city || '';
        state.state = event.mode.state || '';
        state.country = event.mode.country || '';
        state.capacity = event.mode.capacity ? String(event.mode.capacity) : '';
      }

      if (event.descriptionBlocks) {
        state.blocks = event.descriptionBlocks.map((b) => ({
          id: b.id || Math.random().toString(),
          type: b.blockType,
          content: b.content || '',
          level: b.headingLevel as DescriptionBlock['level'] | undefined,
          textSize: b.textSize as DescriptionBlock['textSize'] | undefined,
          listStyle: b.listStyle as DescriptionBlock['listStyle'] | undefined,
        }));
      }

      if (event.passes) {
        state.passes = event.passes.map((p) => ({
          id: p.id || Math.random().toString(),
          pricing: p.pricing as 'FREE' | 'PAID',
          tier: p.tier as 'GA' | 'VIP' | 'VVIP' | 'CUSTOM',
          customName: p.customName || '',
          category: (p.passCategory || 'SINGLE') as PassCategory,
          quantity: p.quantity ? String(p.quantity) : '',
          price: p.price ? String(p.price) : '',
        }));
      }

      if (event.coupons) {
        state.coupons = event.coupons.map((c) => ({
          id: c.id || Math.random().toString(),
          code: c.code,
          discountType: c.discountType as 'PERCENTAGE' | 'AMOUNT',
          discountValue: c.discountValue ? String(c.discountValue) : '',
        }));
      }

      if (event.paymentSetting) {
        state.acceptedMethods = event.paymentSetting.acceptedMethods || [
          'RAZORPAY',
          'CHECKIN',
        ];
      }

      // Create a copy for lastSavedValues
      state.lastSavedValues = {
        eventId: state.eventId,
        stepper: state.stepper,
        title: state.title,
        headerImage: state.headerImage,
        startDate: state.startDate,
        startTime: state.startTime,
        endDate: state.endDate,
        endTime: state.endTime,
        category: state.category,
        eventMode: state.eventMode,
        generateMeetLink: state.generateMeetLink,
        onlineLink: state.onlineLink,
        meetingStartDate: state.meetingStartDate,
        meetingStartTime: state.meetingStartTime,
        meetingEndDate: state.meetingEndDate,
        meetingEndTime: state.meetingEndTime,
        offlineAddress: state.offlineAddress,
        offlineMapLink: state.offlineMapLink,
        offlineLandmark: state.offlineLandmark,
        city: state.city,
        state: state.state,
        country: state.country,
        capacity: state.capacity,
        blocks: state.blocks,
        passes: state.passes,
        coupons: state.coupons,
        acceptedMethods: state.acceptedMethods,
      };
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
  updateEventFromSaved,
  resetForm,
} = createEventSlice.actions;

export default createEventSlice.reducer;
