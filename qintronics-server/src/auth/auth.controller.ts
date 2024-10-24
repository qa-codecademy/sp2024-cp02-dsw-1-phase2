import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { NoSensitiveUserResponse } from 'src/users/dtos/no-sensitive-user-response.dto';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginDto } from './dtos/login.dto';
import { LogoutDto } from './dtos/logout.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokensResponse } from './dtos/refresh-tokens-response.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    type: NoSensitiveUserResponse,
    description: 'User has been registered.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body information.' })
  @ApiConflictResponse({ description: 'User already exists.' })
  register(@Body() body: RegisterDto): Promise<NoSensitiveUserResponse> {
    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    type: LoginResponseDto,
    status: 200,
    description: 'User has successfully logged in.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body information.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(body);
  }

  @Post('refresh-tokens')
  @ApiOperation({ summary: `Refresh user's tokens` })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    type: RefreshTokensResponse,
    status: 200,
    description: 'Tokens have been refreshed.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  refreshTokens(
    @Body() { refreshToken }: RefreshTokenDto,
  ): Promise<RefreshTokensResponse> {
    return this.authService.refreshTokens(refreshToken);
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

  @UseGuards(JwtGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Log out a user' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({
    status: 200,
    description: 'User has successfully logged out.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token.' })
  logout(@Body() body: LogoutDto): Promise<void> {
    return this.authService.logout(body);
  }
}
