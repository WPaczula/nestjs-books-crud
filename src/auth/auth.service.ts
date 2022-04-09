import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Token } from './interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<Token> {
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

  async updateRefreshTokenHash(user: User, refreshToken: string) {
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

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getToken(user: User): Promise<Token> {
    const payload = {
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
