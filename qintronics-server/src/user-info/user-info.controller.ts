import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { DeleteUserInfoDto } from './dtos/delete-user-info.dto';
import { NoSensitiveUserInfoResponseDto } from './dtos/no-sensitive-user-info-response.dto';
import { UpdateUserInfoDto } from './dtos/update-user-info.dto';
import { UserInfoService } from './user-info.service';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Customer) // Can other roles see their profile info, or just customer?
@Controller('user-info')
@ApiTags('User Info')
export class UserInfoController {
  constructor(private readonly userInfoService: UserInfoService) {}

  @Patch('update') // When accessing /me page, all user info will be sent, including the user info ID, so the front end can send it as a route param
  @ApiBody({ type: UpdateUserInfoDto })
  @ApiOkResponse({
    type: NoSensitiveUserInfoResponseDto,
    description: 'User info has been updated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body information.',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async updateUserInfo(
    @Body() body: UpdateUserInfoDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<NoSensitiveUserInfoResponseDto> {
    const userInfo = await this.userInfoService.changeUserInfo(
      currentUser,
      body,
    );

    return plainToInstance(NoSensitiveUserInfoResponseDto, userInfo, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('delete')
  @ApiBody({ type: DeleteUserInfoDto })
  @ApiOkResponse({
    type: NoSensitiveUserInfoResponseDto,
    description: 'User info has been deleted.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body information.',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async deleteSomeUserInfo(
    @Body() body: DeleteUserInfoDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<NoSensitiveUserInfoResponseDto> {
    const userInfo = await this.userInfoService.changeUserInfo(
      currentUser,
      body,
    );

    return plainToInstance(NoSensitiveUserInfoResponseDto, userInfo, {
      excludeExtraneousValues: true,
    });
  }
}
