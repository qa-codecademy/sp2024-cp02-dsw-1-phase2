import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { Role } from 'src/common/enums/roles.enum';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { UserInfoService } from 'src/user-info/user-info.service';
import { Brackets, Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersQueryDto } from './dtos/users-query.dto';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { PageMetaDto } from 'src/common/pagination/page-meta.dto';
import { PageDto } from 'src/common/pagination/page.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userInfoService: UserInfoService,
  ) {}

  async getAllUsers(
    { search }: UsersQueryDto,
    paginationQueries: PageOptionsDto,
  ): Promise<PageDto<User>> {
    const { skip, perPage } = paginationQueries;

    const usersQuery = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userInfo', 'userInfo');

    if (search) {
      usersQuery
        .where('user.firstName LIKE :searchParam', { search: `%${search}%` })
        .orWhere('user.lastName LIKE :searchParam', { search: `%${search}%` })
        .orWhere('user.email LIKE :searchParam', { search: `%${search}%` });
    }

    usersQuery.skip(skip).take(perPage);

    const [entities, itemCount] = await usersQuery.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount, paginationQueries });

    return new PageDto(entities, pageMetaDto);
  }

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: { userInfo: true },
    });
  }

  // will everything be returned (even the sensitive info)? If so, make NoSensitiveUser in the controller (will use same function in auth, where refresh tokens are needed, and in NoSensitiveUser they won't be exposed)
  async getUserProfile(currentUser: ICurrentUser): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { id: currentUser.userId }, // Just customer users or?
      relations: { userInfo: true },
    });

    if (!foundUser) throw new NotFoundException('User does not exist.');

    if (foundUser.userInfo.ccNum)
      foundUser.userInfo.ccNum = `************${foundUser.userInfo.ccNum.slice(-4)}`;

    return foundUser;
  }

  // same here about sensitivity
  async getUserByEmail(email: string): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { email },
      relations: { userInfo: true },
    });

    if (!foundUser) throw new NotFoundException('User does not exist.');

    return foundUser;
  }

  async createUser(body: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({
      email: body.email,
    });

    if (existingUser) throw new ConflictException('User already exists!');

    const { firstName, lastName, ...restOfBody } = body;

    const savedUserInfo = await this.userInfoService.createUserInfo({
      firstName,
      lastName,
    });

    restOfBody.password = await bcrypt.hash(
      restOfBody.password,
      Number(process.env.BCRYPT_SALT),
    );

    const fullUser = {
      ...restOfBody,
      userInfo: savedUserInfo,
    };

    const createdUser = this.userRepository.create(fullUser);
    return this.userRepository.save(createdUser);
  }

  async saveNewPassword(userId: string, password: string): Promise<void> {
    password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
  }

  async changeUserRole(id: string, role: Role): Promise<User> {
    const foundUser = await this.getUserById(id);

    if (!foundUser)
      throw new NotFoundException(`User with id: ${id} does not exist!`);

    return this.userRepository.save({ ...foundUser, role });
  }

  async deleteUser(id: string): Promise<void> {
    // Relations must be loaded here, or else there won't be cascade delete
    const userToBeDeleted = await this.userRepository.findOne({
      where: { id },
      relations: { userInfo: true, favoriteProducts: true },
    });

    if (!userToBeDeleted) return;

    userToBeDeleted.favoriteProducts = [];
    await this.userRepository.save(userToBeDeleted);

    // Soft remove must receive an entity or there will be an internal error
    await this.userRepository.softRemove(userToBeDeleted);
  }

  async backfillUsers(): Promise<User[]> {
    await this.userRepository.createQueryBuilder('user').delete().execute();
    await this.userInfoService.deleteAllUserInfo();

    const users = [
      {
        email: 'admin@example.com',
        password: 'Admin11!',
        firstName: 'Admin',
        lastName: 'Adminovski',
        role: Role.Admin,
      },
      {
        email: 'delivery@example.com',
        password: 'Delivery1!',
        firstName: 'Delivery',
        lastName: 'Deliveryski',
        role: Role.DeliveryPerson,
      },
      {
        email: 'customer1@example.com',
        password: 'Customer1!',
        firstName: 'Customer1',
        lastName: 'Customer1ski',
        role: Role.Customer,
      },
      {
        email: 'customer2@example.com',
        password: 'Customer2!',
        firstName: 'Customer2',
        lastName: 'Customer2ski',
        role: Role.Customer,
      },
      {
        email: 'customer3@example.com',
        password: 'Customer3!',
        firstName: 'Customer3',
        lastName: 'Customer3ski',
        role: Role.Customer,
      },
    ];

    for (const user of users) {
      user.password = await bcrypt.hash(
        user.password,
        Number(process.env.BCRYPT_SALT),
      );

      const savedUserInfo = await this.userInfoService.createUserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
      });

      const { firstName, lastName, ...restOfUser } = user;

      const fullUser = {
        ...restOfUser,
        userInfo: savedUserInfo,
      };

      const createdUser = this.userRepository.create(fullUser);
      await this.userRepository.save(createdUser);
    }

    return this.userRepository.find({ relations: { userInfo: true } });
  }
}
