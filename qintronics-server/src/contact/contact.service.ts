import { Injectable } from '@nestjs/common';
import { ContactCreateDto } from './dtos/contact-create.dto';
import { EmailService } from 'src/email/email.service';
import { newsletterSubscribeDto } from './dtos/newsLetterSubscribe.dto';

@Injectable()
export class ContactService {
  constructor(private readonly emailService: EmailService) {}

  async contact(body: ContactCreateDto) {
    await this.emailService.sendContactEmail(
      body.name,
      body.email,
      body.phone,
      body.message,
    );
  }

  async newsletterSubscribe(body: newsletterSubscribeDto) {
    await this.emailService.sendNewsletterSubscribeEmail(body.email);
  }
}
