export const formatEventDates = <
  T extends {
    startDate?: Date | string | null;
    endDate?: Date | string | null;
  },
>(
  event: T,
): T => {
  if (event.startDate && typeof event.startDate === 'string') {
    event.startDate = new Date(event.startDate);
  }
  if (event.endDate && typeof event.endDate === 'string') {
    event.endDate = new Date(event.endDate);
  }
  return event;
};
