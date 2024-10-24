import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IRefreshToken } from 'src/common/types/refresh-token.interface';
import { User } from 'src/users/user.entity';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async saveRefreshToken(refreshTokenObject: IRefreshToken) {
    const refreshToken = this.refreshTokenRepository.create(refreshTokenObject);

    return this.refreshTokenRepository.save(refreshToken);
  }

  async validateRefreshTokenForUser(user: User, refreshToken: string) {
    const validToken = this.refreshTokenRepository.findOneBy({
      user,
      refreshToken,
    });

    if (!validToken) throw new UnauthorizedException('Invalid token.');
  }

  async removeRefreshToken(user: User, refreshToken: string) {
    return this.refreshTokenRepository.delete({ user, refreshToken });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanUpExpiredTokens() {
    const currentTime = new Date();

    return this.refreshTokenRepository.delete({
      expDate: LessThan(currentTime),
    });
  }
}
