import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { IRefreshToken } from 'src/common/types/refresh-token.interface';
import { IResetPasswordToken } from 'src/common/types/reset-password-token.interface';
import { EmailService } from 'src/email/email.service';
import { RefreshTokensService } from 'src/refresh-tokens/refresh-tokens.service';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';
import { NoSensitiveUserResponseDto } from 'src/users/dtos/no-sensitive-user-response.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginRefreshResponseDto } from './dtos/login-refresh-response.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ILoginRefreshUser } from 'src/common/types/login-refresh-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokensService: RefreshTokensService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly emailService: EmailService,
  ) {}

  async register(body: RegisterDto): Promise<NoSensitiveUserResponseDto> {
    const createdUser = await this.usersService.createUser(body);

    return plainToInstance(NoSensitiveUserResponseDto, createdUser, {
      excludeExtraneousValues: true,
    });
  }

  async login(loggedUser: LoginDto): Promise<LoginRefreshResponseDto> {
    const foundUser: User = await this.usersService.getUserByEmail(
      loggedUser.email,
    );

    const validPassword = await bcrypt.compare(
      loggedUser.password,
      foundUser.password,
    );

    if (!validPassword) throw new UnauthorizedException('Invalid credentials.');

    return this.#createTokensForUser(foundUser);
  }

  async refreshTokens(
    sentRefreshToken: string,
  ): Promise<LoginRefreshResponseDto> {
    try {
      const foundUser =
        await this.#authenticateRefreshTokenForUser(sentRefreshToken);

      return this.#createTokensForUser(foundUser);
    } catch (error) {
      // If verification fails
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const foundUser = await this.usersService.getUserByEmail(email);

    const resetPasswordToken =
      await this.#generateResetPasswordToken(foundUser);

    const resetPasswordTokenObject: IResetPasswordToken = {
      resetPasswordToken,
      expDate: new Date(
        Date.now() + parseInt(process.env.JWT_RESET_PASSWORD_EXPIRATION_TIME),
      ),
      user: foundUser,
    };

    await this.resetPasswordService.saveResetPasswordToken(
      resetPasswordTokenObject,
    );

    await this.emailService.sendResetPasswordEmail(
      foundUser.email,
      foundUser.userInfo.firstName,
      resetPasswordToken,
    );
  }

  async resetPassword({ token, password }: ResetPasswordDto): Promise<void> {
    try {
      const foundUser = await this.#verifyToken(
        token,
        process.env.JWT_RESET_PASSWORD_SECRET,
      );

      await this.resetPasswordService.validateResetPasswordTokenForUser(
        foundUser,
        token,
      );

      await this.resetPasswordService.removeResetPasswordToken(
        foundUser,
        token,
      );

      await this.usersService.saveNewPassword(foundUser.id, password);
    } catch (error) {
      // If verification fails
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async logout(sentRefreshToken: string): Promise<void> {
    try {
      await this.#authenticateRefreshTokenForUser(sentRefreshToken);
    } catch (error) {
      // If verification fails
      throw new UnauthorizedException('Invalid token.');
    }
  }

  async #generateTokens(loggedUser: ICurrentUser) {
    // expiresIn needs the value in seconds or as a string

    const accessToken = await this.jwtService.signAsync(
      { sub: loggedUser.userId, ...loggedUser },
      {
        expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION_TIME) / 1000,
        secret: process.env.JWT_ACCESS_SECRET,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: loggedUser.userId, ...loggedUser },
      {
        expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME) / 1000,
        secret: process.env.JWT_REFRESH_SECRET,
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async #generateResetPasswordToken(user: User) {
    // expiresIn needs the value in seconds or as a string

    const resetPasswordToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn:
          parseInt(process.env.JWT_RESET_PASSWORD_EXPIRATION_TIME) / 1000,
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
      },
    );

    return resetPasswordToken;
  }

  async #verifyToken(token, secret) {
    const { sub: userId, role } = await this.jwtService.verifyAsync(token, {
      secret,
    });

    const foundUser = await this.usersService.getUserById(userId);

    if (!foundUser || foundUser.role !== role)
      throw new UnauthorizedException('Invalid token.');

    return foundUser;
  }

  async #createTokensForUser(user: User) {
    const cleanUser: ILoginRefreshUser = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.userInfo.firstName,
    };

    const { accessToken, refreshToken } = await this.#generateTokens(cleanUser);

    const refreshTokenObject: IRefreshToken = {
      refreshToken,
      expDate: new Date(
        Date.now() + parseInt(process.env.JWT_REFRESH_EXPIRATION_TIME),
      ),
      user,
    };

    await this.refreshTokensService.saveRefreshToken(refreshTokenObject);

    return {
      ...cleanUser,
      accessToken,
      refreshToken,
    };
  }

  async #authenticateRefreshTokenForUser(refreshToken: string) {
    const foundUser = await this.#verifyToken(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );

    await this.refreshTokensService.validateRefreshTokenForUser(
      foundUser,
      refreshToken,
    );

    await this.refreshTokensService.removeRefreshToken(foundUser, refreshToken);

    return foundUser;
  }
}
