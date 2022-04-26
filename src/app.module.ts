import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot(), BookModule],
})
export class AppModule {}
