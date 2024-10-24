import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from 'src/common/enums/roles.enum';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

type JwtStrategyPayload = {
  sub: string;
  email: string;
  role: Role;
  iat: number;
  exp: number;
  issuer: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.accessToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  // Validate the sent access token
  async validate({
    sub: userId,
    email,
    role,
  }: JwtStrategyPayload): Promise<ICurrentUser> {
    const foundUser = await this.usersService.getUserById(userId);

    if (!foundUser || foundUser.email !== email || foundUser.role !== role)
      throw new UnauthorizedException('Invalid token.');

    return { userId, email, role };
  }
}
