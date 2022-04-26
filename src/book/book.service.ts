import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { IBook } from './interfaces/book.interface';

@Injectable()
export class BookService {
  constructor(private prismaService: PrismaService) {}

  async createBook(
    userId: string,
    title: string,
    author: string,
    publishingHouse: string,
    receivedAt: Date | null = null,
  ): Promise<IBook> {
    const book = await this.prismaService.book.create({
      data: { title, author, publishingHouse, userId, receivedAt },
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

  async updateReceivedAt(
    id: string,
    receivedAt: Date | null,
    userId: string,
  ): Promise<IBook> {
    const book = await this.prismaService.book.findUnique({
      where: {
        id,
      },
      include: { user: true },
    });

    if (!book || book.userId !== userId) {
      throw new NotFoundException('Book not found');
    }

    const updatedBook = await this.prismaService.book.update({
      where: { id },
      data: { receivedAt },
    });

    return updatedBook;
  }
}
