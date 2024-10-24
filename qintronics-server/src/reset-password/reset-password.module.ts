import { Module } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResetPasswordToken } from './reset-password-token.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResetPasswordToken]),
    ScheduleModule.forRoot(),
  ],
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
