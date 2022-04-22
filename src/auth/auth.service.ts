import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { IToken } from './interfaces';
import { ConfigService } from '@nestjs/config';
import { ITokenUser } from './interfaces/tokenUser.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<IToken> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatch = await bcrypt.compare(password, user.hash);
    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const token = await this.getToken(user);
    await this.updateRefreshTokenHash(user, token.refreshToken);
    return token;
  }

  async signUp(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<IToken> {
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Password and confirm password have to match',
      );
    }

    const hash = await this.hashData(password);
    const user = await this.prisma.user.create({ data: { email, hash } });
    const token = await this.getToken(user);
    await this.updateRefreshTokenHash(user, token.refreshToken);

    return token;
  }

  async logout(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRefreshToken: null },
    });
  }

  async refreshToken(userId: number, refreshToken: string): Promise<IToken> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    if ((await this.refreshTokenMatches(user, refreshToken)) !== true) {
      throw new UnauthorizedException();
    }

    const newToken = await this.getToken(user);
    await this.updateRefreshTokenHash(user, newToken.refreshToken);
    return newToken;
  }

  private async refreshTokenMatches(user: User, refreshToken: string) {
    return await bcrypt.compare(refreshToken, user.hashedRefreshToken);
  }

  private async updateRefreshTokenHash(user: User, refreshToken: string) {
    const hash = await this.hashData(refreshToken);
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedRefreshToken: hash,
      },
    });
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async getToken(user: User): Promise<IToken> {
    const payload: ITokenUser = {
      userId: user.id,
      email: user.email,
    };

    const accessTokenPromise = this.jwtService.signAsync(payload, {
      expiresIn: 60 * 15,
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
    });
    const refreshTokenPromise = this.jwtService.signAsync(payload, {
      expiresIn: 60 * 60 * 24,
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    return { accessToken, refreshToken };
  }
}
