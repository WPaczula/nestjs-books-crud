import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IBook } from './interfaces/book.interface';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  async createBook(
    title: string,
    author: string,
    publishingHouse: string,
    userId: string,
  ): Promise<IBook> {
    const book = await this.prismaService.book.create({
      data: { title, author, publishingHouse, userId },
    });

    return book;
  }

  async getBooks(userId: string): Promise<Array<IBook>> {
    const books = await this.prismaService.book.findMany({
      orderBy: { createdAt: 'asc' },
      where: {
        userId,
      },
    });

    return books;
  }
}
