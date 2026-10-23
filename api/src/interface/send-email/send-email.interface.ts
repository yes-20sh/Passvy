import { Attachment } from 'nodemailer/lib/mailer';

export interface SendEmailInput {
  to: string | string[];
  cc?: string | string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
}
