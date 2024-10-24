import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
