import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './refresh-token.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken]), ScheduleModule.forRoot()],
  providers: [RefreshTokensService],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
