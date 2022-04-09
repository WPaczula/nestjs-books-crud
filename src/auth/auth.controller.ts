import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Authenticated } from './decorators/auth.guard';
import { CurrentUser } from './decorators/currentUser.guard';
import { SignInUserDto, SignUpUserDto } from './dto';
import { TokenDto } from './dto/token.dto';
import { JWTPayload } from './interfaces/jwtPayload.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() createUserDto: SignUpUserDto): Promise<TokenDto> {
    const { confirmPassword, email, password } = createUserDto;
    return this.authService.signUp(email, password, confirmPassword);
  }

  @Post('/signin')
  signIn(@Body() signInUserDto: SignInUserDto): Promise<TokenDto> {
    const { email, password } = signInUserDto;

    return this.authService.signIn(email, password);
  }

  @Post('/logout')
  @Authenticated()
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: JWTPayload) {
    await this.authService.logout(user.userId);
  }
}
