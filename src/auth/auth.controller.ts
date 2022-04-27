import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UseAuthenticationToken,
  UseRefreshToken,
  TokenUser,
} from './decorators';
import { Token } from './decorators/token.decorator';
import { SignInUserDto, SignUpUserDto } from './dto';
import { TokenDto } from './dto/token.dto';
import { ITokenUser } from './interfaces/tokenUser.interface';

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
  @UseAuthenticationToken()
  @HttpCode(HttpStatus.OK)
  async logout(@TokenUser() user: ITokenUser) {
    await this.authService.logout(user.userId);
  }

  @Post('/refresh')
  @UseRefreshToken()
  @HttpCode(HttpStatus.CREATED)
  async refresh(@TokenUser() user: ITokenUser, @Token() token: string) {
    return this.authService.refreshToken(user.userId, token);
  }

  @Get('/')
  @UseAuthenticationToken()
  @HttpCode(HttpStatus.OK)
  helloWorld(@TokenUser() user: ITokenUser) {
    return `Hello ${user.email}`;
  }
}
