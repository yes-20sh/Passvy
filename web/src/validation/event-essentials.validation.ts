import { z } from "zod";

export const eventEssentialsSchema = z.object({
  title: z.string().min(1, "Event title is required").refine((val) => {
    return val.trim().split(/\s+/).length <= 5;
  }, "Event title cannot be more than 5 words"),
  startDate: z.date({ required_error: "Start date is required" }),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.date({ required_error: "End date is required" }),
  endTime: z.string().min(1, "End time is required"),
  category: z.string().min(1, "Event category is required"),
}).superRefine((data, ctx) => {
  if (data.startDate && data.startTime && data.endDate && data.endTime) {
    const start = new Date(data.startDate);
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    start.setHours(startHours, startMinutes, 0, 0);

    const end = new Date(data.endDate);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);
    end.setHours(endHours, endMinutes, 0, 0);

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["endDate"],
      });
    }
  }
});

export type EventEssentialsSchemaType = z.infer<typeof eventEssentialsSchema>;
