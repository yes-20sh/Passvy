'use client';

import React, { useState } from 'react';
import { CreateEventStepper } from '../../molecules/create-event-stepper/create-event-stepper';
import { EventEssentialsForm } from '../../molecules/event-essentials-form/event-essentials-form';
import { EventModeForm } from '../../molecules/event-mode-form/event-mode-form';
import { EventDescriptionForm } from '../../molecules/event-description-form/event-description-form';
import { EventPassesForm } from '../../molecules/event-passes-form/event-passes-form';
import { EventPaymentsForm } from '../../molecules/event-payments-form/event-payments-form';
import { EventLivePreview } from '../../molecules/event-live-preview/event-live-preview';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/atoms/alert-dialog';

// GraphQL/Apollo
import { useMutation, useQuery } from '@apollo/client/react';
import {
  CreateEventDocument,
  GetEventDocument,
  CreateEventInput,
  EventStep,
  EventMode,
  PassPricing,
  PassTier,
  DiscountType,
} from '@/gql/graphql';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

// Redux hooks and actions
import { useAppSelector } from '@/store/hooks/useAppSelector';
import { useAppDispatch } from '@/store/hooks/useAppDispatch';
import {
  setStep,
  updateField,
  setBlocks,
  setPasses,
  setCoupons,
  setAcceptedMethods,
  updateEventFromSaved,
  CreateEventState,
} from '@/store/slices/create-event.slice';

const isSameDate = (
  d1: string | Date | null | undefined,
  d2: string | Date | null | undefined,
) => {
  if (!d1 && !d2) return true;
  if (!d1 || !d2) return false;
  return new Date(d1).getTime() === new Date(d2).getTime();
};

const normalizeTime = (t: string | null | undefined) => {
  if (!t) return '';
  return t.length === 5 ? t + ':00' : t;
};

const hasStepChanges = (
  step: number,
  current: CreateEventState,
  saved: CreateEventState['lastSavedValues'],
) => {
  if (!saved) return true;

  switch (step) {
    case 1: {
      const isTitleDiff = current.title !== (saved.title ?? '');
      const isHeaderDiff = current.headerImage !== (saved.headerImage ?? '');
      const isStartDiff = !isSameDate(current.startDate, saved.startDate);
      const isStartTimeDiff =
        normalizeTime(current.startTime) !== normalizeTime(saved.startTime);
      const isEndDiff = !isSameDate(current.endDate, saved.endDate);
      const isEndTimeDiff =
        normalizeTime(current.endTime) !== normalizeTime(saved.endTime);
      const isCategoryDiff = current.category !== (saved.category ?? '');

      console.log('hasStepChanges 1:', {
        isTitleDiff,
        isHeaderDiff,
        isStartDiff,
        isStartTimeDiff,
        isEndDiff,
        isEndTimeDiff,
        isCategoryDiff,
      });

      return (
        isTitleDiff ||
        isHeaderDiff ||
        isStartDiff ||
        isStartTimeDiff ||
        isEndDiff ||
        isEndTimeDiff ||
        isCategoryDiff
      );
    }
    case 2:
      return JSON.stringify(current.blocks) !== JSON.stringify(saved.blocks);
    case 3:
      return (
        current.eventMode !== saved.eventMode ||
        current.generateMeetLink !== saved.generateMeetLink ||
        current.onlineLink !== (saved.onlineLink ?? '') ||
        !isSameDate(current.meetingStartDate, saved.meetingStartDate) ||
        normalizeTime(current.meetingStartTime) !==
          normalizeTime(saved.meetingStartTime) ||
        !isSameDate(current.meetingEndDate, saved.meetingEndDate) ||
        normalizeTime(current.meetingEndTime) !==
          normalizeTime(saved.meetingEndTime) ||
        current.offlineAddress !== (saved.offlineAddress ?? '') ||
        current.offlineMapLink !== (saved.offlineMapLink ?? '') ||
        current.offlineLandmark !== (saved.offlineLandmark ?? '') ||
        current.city !== (saved.city ?? '') ||
        current.state !== (saved.state ?? '') ||
        current.country !== (saved.country ?? '') ||
        current.capacity !== (saved.capacity ?? '')
      );
    case 4:
      return (
        JSON.stringify(current.passes) !== JSON.stringify(saved.passes) ||
        JSON.stringify(current.coupons) !== JSON.stringify(saved.coupons)
      );
    case 5:
      return (
        JSON.stringify(current.acceptedMethods) !==
        JSON.stringify(saved.acceptedMethods)
      );
    default:
      return false;
  }
};

interface ExtendedCreateEventInput extends CreateEventInput {
  city?: string;
  state?: string;
  country?: string;
}

export const CreateEventForm = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.createEvent);
  const router = useRouter();
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');

  const { data: eventData, error: queryError } = useQuery(GetEventDocument, {
    variables: { slug: slugParam || '' },
    skip: !slugParam,
    fetchPolicy: 'network-only',
  });

  if (queryError) {
    console.error('GraphQL Query Error:', queryError);
  }

  React.useEffect(() => {
    if (eventData?.getEvent?.event) {
      dispatch(updateEventFromSaved(eventData.getEvent.event));
      const stepMap: Record<string, number> = {
        ESSENTIALS: 1,
        DESCRIPTION: 2,
        MODE: 3,
        PASSES: 4,
        PAYOUTS: 5,
      };
      const savedStep = eventData.getEvent.event.stepper;
      if (savedStep && stepMap[savedStep]) {
        // savedStep represents the last COMPLETED step, so jump to the NEXT step
        const nextStep = Math.min(5, stepMap[savedStep] + 1);
        dispatch(setStep(nextStep));
      }
    }
  }, [eventData, dispatch]);

  const [createEventMutation, { loading }] = useMutation(CreateEventDocument);
  const [showConfirm, setShowConfirm] = useState(false);
  const [highestStep, setHighestStep] = useState(formState.step);

  if (formState.step > highestStep) {
    setHighestStep(formState.step);
  }

  const handleSave = async (stepNum: number, isPublishing = false) => {
    try {
      const stepperMap: Record<number, EventStep> = {
        1: 'ESSENTIALS',
        2: 'DESCRIPTION',
        3: 'MODE',
        4: 'PASSES',
        5: 'PAYOUTS',
      };

      const input: ExtendedCreateEventInput = {
        eventId: formState.eventId || undefined,
        title: formState.title,
        category: formState.category || undefined,
        startDate: formState.startDate || undefined,
        startTime: formState.startTime || undefined,
        endDate: formState.endDate || undefined,
        endTime: formState.endTime || undefined,
        headerImage: formState.headerImage || undefined,

        descriptionBlocks: formState.blocks.map((block, idx) => ({
          blockType: block.type,
          content: block.content,
          headingLevel: block.level || undefined,
          textSize: block.textSize || undefined,
          listStyle: block.listStyle || undefined,
          sortOrder: idx + 1,
        })),

        eventMode: formState.eventMode as EventMode,
        onlineLink: formState.onlineLink || undefined,
        offlineAddress: formState.offlineAddress || undefined,
        offlineMapLink: formState.offlineMapLink || undefined,
        offlineLandmark: formState.offlineLandmark || undefined,
        city: formState.city || undefined,
        state: formState.state || undefined,
        country: formState.country || undefined,
        capacity: formState.capacity
          ? parseInt(formState.capacity, 10)
          : undefined,

        passes: formState.passes.map((p) => ({
          pricing: p.pricing as PassPricing,
          tier: p.tier as PassTier,
          customName: p.customName || undefined,
          passCategory: p.category || undefined,
          quantity: p.quantity ? parseInt(p.quantity, 10) : undefined,
          price: p.pricing === 'FREE' ? 0 : p.price ? parseFloat(p.price) : 0,
        })),
        coupons: formState.coupons.map((c) => ({
          code: c.code,
          discountType: c.discountType as DiscountType,
          discountValue: parseFloat(c.discountValue) || 0,
        })),

        paymentSetting: {
          acceptedMethods: formState.acceptedMethods,
        },

        stepper: stepperMap[stepNum],
        status: isPublishing ? 'PUBLISHED' : 'DRAFT',
      };

      const { data } = await createEventMutation({
        variables: { input },
      });

      if (data?.createEvent?.event) {
        dispatch(updateEventFromSaved(data.createEvent.event));
        toast.success(data.createEvent.message || 'Event saved successfully!');

        if (!slugParam && data.createEvent.event.slug) {
          router.replace(
            `/host/events/create?slug=${data.createEvent.event.slug}`,
          );
        }

        if (isPublishing) {
          router.push('/host/events');
        } else {
          if (stepNum < 5) dispatch(setStep(stepNum + 1));
        }
      } else {
        toast.error('Failed to save event');
      }
    } catch (err) {
      console.error(err);
      const error = err as Error;
      toast.error(error.message || 'An error occurred while saving the event.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmPublish = () => {
    setShowConfirm(false);
    handleSave(5, true);
  };

  // Wrapper handlers to convert values and dispatch cleanly
  const handleUpdate = <K extends keyof typeof formState>(
    field: K,
    value: (typeof formState)[K],
  ) => {
    dispatch(updateField({ field, value }));
  };

  // Convert Date strings to Date objects for the DatePicker
  const parsedStartDate = formState.startDate
    ? new Date(formState.startDate)
    : undefined;
  const parsedEndDate = formState.endDate
    ? new Date(formState.endDate)
    : undefined;

  const stepChanges = hasStepChanges(
    formState.step,
    formState,
    formState.lastSavedValues,
  );

  return (
    <div className="flex w-full flex-col gap-10">
      <CreateEventStepper step={formState.step} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
        <div className="flex flex-col gap-8 text-left md:col-span-3">
          {formState.step === 1 && (
            <EventEssentialsForm
              title={formState.title}
              setTitle={(v) => handleUpdate('title', v)}
              headerImage={formState.headerImage}
              setHeaderImage={(v) => handleUpdate('headerImage', v)}
              startDate={parsedStartDate}
              setStartDate={(v) => handleUpdate('startDate', v?.toISOString())}
              startTime={formState.startTime}
              setStartTime={(v) => handleUpdate('startTime', v)}
              endDate={parsedEndDate}
              setEndDate={(v) => handleUpdate('endDate', v?.toISOString())}
              endTime={formState.endTime}
              setEndTime={(v) => handleUpdate('endTime', v)}
              category={formState.category}
              setCategory={(v) => handleUpdate('category', v)}
              onNext={() => dispatch(setStep(2))}
              hasChanges={stepChanges}
              onSave={() => handleSave(1)}
              isSaving={loading}
            />
          )}

          {formState.step === 2 && (
            <EventDescriptionForm
              blocks={formState.blocks}
              setBlocks={(b) => {
                if (typeof b === 'function') {
                  dispatch(setBlocks(b(formState.blocks)));
                } else {
                  dispatch(setBlocks(b));
                }
              }}
              onBack={() => dispatch(setStep(1))}
              onNext={() => dispatch(setStep(3))}
              hasChanges={stepChanges}
              onSave={() => handleSave(2)}
              isSaving={loading}
            />
          )}

          {formState.step === 3 && (
            <EventModeForm
              eventMode={formState.eventMode}
              setEventMode={(v) => handleUpdate('eventMode', v)}
              meetingStartDate={
                formState.meetingStartDate
                  ? new Date(formState.meetingStartDate)
                  : undefined
              }
              setMeetingStartDate={(v) =>
                handleUpdate('meetingStartDate', v?.toISOString())
              }
              meetingStartTime={formState.meetingStartTime}
              setMeetingStartTime={(v) => handleUpdate('meetingStartTime', v)}
              meetingEndDate={
                formState.meetingEndDate
                  ? new Date(formState.meetingEndDate)
                  : undefined
              }
              setMeetingEndDate={(v) =>
                handleUpdate('meetingEndDate', v?.toISOString())
              }
              meetingEndTime={formState.meetingEndTime}
              setMeetingEndTime={(v) => handleUpdate('meetingEndTime', v)}
              mainStartDate={parsedStartDate}
              mainStartTime={formState.startTime}
              mainEndDate={parsedEndDate}
              mainEndTime={formState.endTime}
              offlineAddress={formState.offlineAddress}
              setOfflineAddress={(v) => handleUpdate('offlineAddress', v)}
              offlineMapLink={formState.offlineMapLink}
              setOfflineMapLink={(v) => handleUpdate('offlineMapLink', v)}
              offlineLandmark={formState.offlineLandmark}
              setOfflineLandmark={(v) => handleUpdate('offlineLandmark', v)}
              city={formState.city}
              setCity={(v) => handleUpdate('city', v)}
              state={formState.state}
              setState={(v) => handleUpdate('state', v)}
              country={formState.country}
              setCountry={(v) => handleUpdate('country', v)}
              capacity={formState.capacity}
              setCapacity={(v) => handleUpdate('capacity', v)}
              onBack={() => dispatch(setStep(2))}
              onNext={() => dispatch(setStep(4))}
              hasChanges={stepChanges}
              onSave={() => handleSave(3)}
              isSaving={loading}
            />
          )}

          {formState.step === 4 && (
            <EventPassesForm
              passes={formState.passes}
              setPasses={(p) => {
                if (typeof p === 'function') {
                  dispatch(setPasses(p(formState.passes)));
                } else {
                  dispatch(setPasses(p));
                }
              }}
              coupons={formState.coupons}
              setCoupons={(c) => {
                if (typeof c === 'function') {
                  dispatch(setCoupons(c(formState.coupons)));
                } else {
                  dispatch(setCoupons(c));
                }
              }}
              capacity={formState.capacity}
              onBack={() => dispatch(setStep(3))}
              onNext={() => dispatch(setStep(5))}
              hasChanges={stepChanges}
              onSave={() => handleSave(4)}
              isSaving={loading}
            />
          )}

          {formState.step === 5 && (
            <EventPaymentsForm
              acceptedMethods={formState.acceptedMethods}
              setAcceptedMethods={(m) => {
                if (typeof m === 'function') {
                  dispatch(setAcceptedMethods(m(formState.acceptedMethods)));
                } else {
                  dispatch(setAcceptedMethods(m));
                }
              }}
              onBack={() => dispatch(setStep(4))}
              onSubmit={handleSubmit}
              hasChanges={stepChanges}
              onSave={() => handleSave(5)}
              isSaving={loading}
              hasPaidPasses={formState.passes.some((p) => p.pricing === 'PAID')}
            />
          )}

          <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish Event?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish{' '}
                  <strong className="text-foreground">
                    {formState.title || 'this event'}
                  </strong>
                  ? Once published, the event will go live and attendees can
                  start purchasing passes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setShowConfirm(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmPublish}
                  className="bg-emerald-600 font-bold text-white hover:bg-emerald-500"
                >
                  Confirm & Publish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <EventLivePreview
          title={formState.title}
          headerImage={formState.headerImage}
          blocks={formState.blocks}
          passes={formState.passes}
          coupons={formState.coupons}
          startDate={parsedStartDate}
          startTime={formState.startTime}
          endDate={parsedEndDate}
          endTime={formState.endTime}
          category={formState.category}
          eventMode={formState.eventMode}
          onlineLink={formState.onlineLink}
          offlineAddress={formState.offlineAddress}
          capacity={formState.capacity}
          currentStep={formState.step}
        />
      </div>
    </div>
  );
};
