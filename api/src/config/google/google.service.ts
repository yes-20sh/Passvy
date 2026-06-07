import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import * as crypto from 'crypto';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  private oauth2Client: InstanceType<typeof google.auth.OAuth2>;

  constructor(private readonly configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_REDIRECT_URI'),
    );

    const refreshToken = this.configService.get<string>('GOOGLE_REFRESH_TOKEN');
    if (refreshToken) {
      this.oauth2Client.setCredentials({ refresh_token: refreshToken });
    } else {
      this.logger.warn(
        'GOOGLE_REFRESH_TOKEN is not defined in environment variables.',
      );
    }
  }

  async createMeetLink(eventDetails: {
    title: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    hostEmail?: string;
  }): Promise<string> {
    try {
      const calendar = google.calendar({
        version: 'v3',
        auth: this.oauth2Client,
      });

      const event: calendar_v3.Schema$Event = {
        summary: eventDetails.title,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: eventDetails.endTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: eventDetails.hostEmail
          ? [{ email: eventDetails.hostEmail }]
          : undefined,
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
      });

      const meetLink = response.data.hangoutLink;
      if (!meetLink) {
        throw new Error('Google Meet link was not generated.');
      }

      return meetLink;
    } catch (error) {
      this.logger.error('Failed to create Google Meet link');
      throw error;
    }
  }
}
