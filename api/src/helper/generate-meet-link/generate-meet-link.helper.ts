import { GenerateMeetLinkParams } from '@/interface';
import { GoogleService } from '@/config/google/google.service';

export async function generateEventMeetLinkHelper(
  googleService: GoogleService,
  { title, startDate, endDate, description }: GenerateMeetLinkParams,
): Promise<string> {
  return googleService.createMeetLink({
    title,
    description,
    startTime: startDate,
    endTime: endDate,
  });
}
