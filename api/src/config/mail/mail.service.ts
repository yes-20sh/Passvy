import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendEmailInput } from '@/interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private readonly from: string;

  constructor() {
    const user = process.env.MAIL_USER;
    const appPassword = process.env.MAIL_APP_PASSWORD;

    if (!user || !appPassword) {
      throw new Error(
        'Missing mail configuration. Set MAIL_USER and MAIL_APP_PASSWORD.',
      );
    }

    this.from = process.env.MAIL_FROM ?? user;

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass: appPassword,
      },
    });
  }

  async sendMail(
    input: SendEmailInput,
  ): Promise<SMTPTransport.SentMessageInfo> {
    const info = await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      cc: input.cc,
      subject: input.subject,
      html: input.html,
      attachments: input.attachments,
    });

    this.logger.log(`Email sent: ${info.messageId}`);

    return info;
  }
}
