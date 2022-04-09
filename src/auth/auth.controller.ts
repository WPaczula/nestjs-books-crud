import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { TokenDto } from './dto/token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: SignUpUserDto): Promise<TokenDto> {
    const { confirmPassword, email, password } = createUserDto;
    return this.authService.signUp(email, password, confirmPassword);
  }

  @Post('/signin')
  signIn(@Body() signInUserDto: SignInUserDto): Promise<TokenDto> {
    const { email, password } = signInUserDto;

    return this.authService.signIn(email, password);
  }
}
