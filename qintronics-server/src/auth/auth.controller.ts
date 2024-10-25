import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { TokenResponseInterceptor } from 'src/common/interceptors/token-response.interceptor';
import { NoSensitiveUserResponseDto } from 'src/users/dtos/no-sensitive-user-response.dto';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { LoginRefreshResponseDto } from './dtos/login-refresh-response.dto';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ClearCookiesInterceptor } from 'src/common/interceptors/clear-cookies.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    type: NoSensitiveUserResponseDto,
    description: 'User has been registered.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body information.' })
  @ApiConflictResponse({ description: 'User already exists.' })
  register(@Body() body: RegisterDto): Promise<NoSensitiveUserResponseDto> {
    return this.authService.register(body);
  }

  @Post('login')
  @UseInterceptors(TokenResponseInterceptor)
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    type: LoginRefreshResponseDto,
    status: 200,
    description: 'User has successfully logged in.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body information.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  async login(@Body() body: LoginDto): Promise<LoginRefreshResponseDto> {
    return this.authService.login(body);
  }

  @Post('refresh-tokens')
  @UseInterceptors(TokenResponseInterceptor)
  @ApiOperation({ summary: `Refresh user's tokens` })
  @ApiResponse({
    status: 200,
    description: 'Tokens have been refreshed.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token.' })
  async refreshTokens(
    @Req() request: Request,
  ): Promise<LoginRefreshResponseDto> {
    if (!request.cookies.refreshToken)
      throw new UnauthorizedException('User is logged out.');

    return this.authService.refreshTokens(request.cookies.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: `Send a "reset password" email to the user` })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'A "reset password" email has been sent to the user.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body information.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  forgotPassword(@Body() { email }: ForgotPasswordDto): Promise<void> {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: `Save user's new password` })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password has been reset.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body information.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  resetPassword(@Body() body: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(body);
  }

  @Post('logout')
  @UseInterceptors(ClearCookiesInterceptor)
  @ApiOperation({ summary: 'Log out a user' })
  @ApiResponse({
    status: 204,
    description: 'User has successfully logged out.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  logout(@Req() request: Request): Promise<void> {
    if (!request.cookies.refreshToken)
      throw new UnauthorizedException('User is logged out.');

    return this.authService.logout(request.cookies.refreshToken);
  }
}
