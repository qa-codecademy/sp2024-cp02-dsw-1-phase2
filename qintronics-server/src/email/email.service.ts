import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, token: string) {
    const subject = 'Reset your password';

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './reset-password-email',
      context: { token },
    });
  }
}
