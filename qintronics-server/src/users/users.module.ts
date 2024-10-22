import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfo } from 'src/user-info/user-info.entity';
import { UserInfoService } from 'src/user-info/user-info.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RefreshToken } from '../refresh-tokens/refresh-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserInfo, RefreshToken])],
  controllers: [UsersController],
  providers: [UsersService, UserInfoService],
  exports: [UsersService],
})
export class UsersModule {}
