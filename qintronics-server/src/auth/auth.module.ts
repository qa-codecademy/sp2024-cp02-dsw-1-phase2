import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from 'src/email/email.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokensModule } from 'src/refresh-tokens/refresh-tokens.module';
import { ResetPasswordModule } from 'src/reset-password/reset-password.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        // Two different  secrets will be used when signing - for access and refresh tokens, that's why secret is not included here, in order to not sign both tokens with the same secret
        // This will be automatically added to the tokens when they're signed
        signOptions: {
          issuer: configService.get('JWT_ISSUER'),
        },
      }),
    }),
    PassportModule,
    UsersModule,
    RefreshTokensModule,
    ResetPasswordModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
