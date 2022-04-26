import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  async createBook(
    title: string,
    author: string,
    publishingHouse: string,
    userId: string,
  ) {
    const book = await this.prismaService.book.create({
      data: { title, author, publishingHouse, userId },
    });

    return book;
  }
}
