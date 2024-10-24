import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [ContactController],
  providers: [ContactService, EmailService],
})
export class ContactModule {}
