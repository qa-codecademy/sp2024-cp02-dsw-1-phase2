import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { BasicUserResponseDto } from './dtos/basic-user-response.dto';
import { UpdateUserRoleDto } from './dtos/update-user-role.dto';
import { UserProfileResponseDto } from './dtos/user-profile-response.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersQueryDto } from './dtos/users-query.dto';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { PageDto } from 'src/common/pagination/page.dto';

@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users and their info' })
  @ApiQuery({
    required: false,
    type: UsersQueryDto,
    name: 'search',
    description: 'Search word for users',
  })
  @ApiOkResponse({
    type: [BasicUserResponseDto],
    description: 'All users are retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  async getAllUsers(
    @Query() query: UsersQueryDto,
    @Query() paginationQueries: PageOptionsDto,
  ): Promise<PageDto<BasicUserResponseDto>> {
    const users = await this.usersService.getAllUsers(query, paginationQueries);

    return new PageDto<BasicUserResponseDto>(
      users.data.map((user) =>
        plainToInstance(BasicUserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      ),
      users.meta,
    );
  }

  @Roles(Role.Customer) // Can other roles see their profile, or just customer?
  @Get('me')
  @ApiOperation({ summary: 'Get a user and their info' })
  @ApiOkResponse({
    type: UserProfileResponseDto,
    description: 'User has been retrieved.',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async getUserByProfile(
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<UserProfileResponseDto> {
    const user = await this.usersService.getUserProfile(currentUser);

    return plainToInstance(UserProfileResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: `Change user's role` })
  @ApiParam({
    type: String,
    name: 'id',
    description: 'User ID',
    example: '991ecd9f-e438-4e56-9231-c68510d31b37',
  })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiOkResponse({
    type: BasicUserResponseDto,
    description: 'User role has been updated.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid route parameter or invalid body.',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  @ApiNotFoundResponse({ description: 'User does not exist.' })
  async changeUserRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { role }: UpdateUserRoleDto,
  ): Promise<BasicUserResponseDto> {
    const user = await this.usersService.changeUserRole(id, role);

    return plainToInstance(BasicUserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: 204,
    description: 'User has been deleted.',
  })
  @ApiBadRequestResponse({ description: 'Invalid route parameter.' })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @PublicRoute()
  @Post('init-users')
  @ApiOperation({ summary: 'Initialize first users' })
  @ApiCreatedResponse({
    type: [User],
    description: 'First users have been created.',
  })
  backfillUsers(): Promise<User[]> {
    return this.usersService.backfillUsers();
  }
}
