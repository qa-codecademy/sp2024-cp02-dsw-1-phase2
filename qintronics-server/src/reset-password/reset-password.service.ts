import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IResetPasswordToken } from 'src/common/types/reset-password-token.interface';
import { User } from 'src/users/user.entity';
import { ResetPasswordToken } from './reset-password-token.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectRepository(ResetPasswordToken)
    private readonly resetPasswordTokenRepository: Repository<ResetPasswordToken>,
  ) {}

  async saveResetPasswordToken(resetPasswordTokenObject: IResetPasswordToken) {
    const resetPasswordToken = this.resetPasswordTokenRepository.create(
      resetPasswordTokenObject,
    );

    return this.resetPasswordTokenRepository.save(resetPasswordToken);
  }

  async validateResetPasswordTokenForUser(
    user: User,
    resetPasswordToken: string,
  ) {
    const validToken = this.resetPasswordTokenRepository.findOneBy({
      user,
      resetPasswordToken,
    });

    if (!validToken) throw new UnauthorizedException('Invalid token.');
  }

  async removeResetPasswordToken(user: User, resetPasswordToken: string) {
    return this.resetPasswordTokenRepository.delete({
      user,
      resetPasswordToken,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpExpiredTokens() {
    const currentTime = new Date();

    return this.resetPasswordTokenRepository.delete({
      expDate: LessThan(currentTime),
    });
  }
}
