import { z } from "zod";

export const eventModeSchema = z.discriminatedUnion("eventMode", [
  z.object({
    eventMode: z.literal("ONLINE"),
    meetingStartDate: z.date({
      required_error: "Meeting start date is required",
    }),
    meetingStartTime: z.string().min(1, "Meeting start time is required"),
    meetingEndDate: z.date({
      required_error: "Meeting end date is required",
    }),
    meetingEndTime: z.string().min(1, "Meeting end time is required"),
    capacity: z.string().min(1, "Capacity is required").refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0 && num <= 100;
    }, "Online events require a capacity between 1 and 100"),
  }),
  z.object({
    eventMode: z.literal("OFFLINE"),
    offlineAddress: z.string().min(1, "Venue address is required"),
    offlineMapLink: z.string().url("Must be a valid URL").min(1, "Google map link is required"),
    capacity: z.string().min(1, "Capacity is required").refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num > 0;
    }, "Capacity must be a valid number greater than 0"),
  }),
]);

export type EventModeSchemaType = z.infer<typeof eventModeSchema>;
