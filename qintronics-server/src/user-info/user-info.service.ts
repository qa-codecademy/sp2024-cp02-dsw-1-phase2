import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInfoDto } from './dtos/create-user-info.dto';
import { NoSensitiveUserInfoResponseDto } from './dtos/no-sensitive-user-info-response.dto';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UserInfo } from './user-info.entity';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { DeleteUserInfoDto } from './dtos/delete-user-info.dto';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async createUserInfo(
    body: CreateUserInfoDto,
  ): Promise<NoSensitiveUserInfoResponseDto> {
    const createdInfo = this.userInfoRepository.create(body);

    return this.userInfoRepository.save(createdInfo);
  }

  async changeUserInfo(
    currentUser: ICurrentUser,
    body: UpdateUserInfoDto | DeleteUserInfoDto,
  ): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOneBy({
      userId: { id: currentUser.userId },
    });

    if (!userInfo) throw new NotFoundException(`User does not exist!`);

    const infoToUpdate = this.userInfoRepository.merge(userInfo, body);

    return this.userInfoRepository.save(infoToUpdate);
  }

  async deleteAllUserInfo(): Promise<void> {
    await this.userInfoRepository
      .createQueryBuilder('user_info')
      .delete()
      .execute();
  }
}
