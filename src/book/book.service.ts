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
    readAt: Date | null = null,
    reviewed = false,
  ): Promise<IBook> {
    const book = await this.prismaService.book.create({
      data: {
        title,
        author,
        publishingHouse,
        userId,
        receivedAt,
        readAt,
        reviewed,
      },
    });

    return book;
  }

  async getBooks(
    userId: string,
    recievedFrom?: Date,
    receivedTo?: Date,
  ): Promise<Array<IBook>> {
    const books = await this.prismaService.book.findMany({
      orderBy: [{ receivedAt: 'asc' }, { createdAt: 'asc' }],
      where: {
        userId,
        receivedAt: {
          gte: recievedFrom,
          lte: receivedTo,
        },
      },
    });

    return books;
  }

  async updateReceivedAt(
    id: string,
    userId: string,
    receivedAt: Date | null,
    readAt: Date | null,
    reviewed: boolean,
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
      data: { receivedAt, readAt, reviewed },
    });

    return updatedBook;
  }
}
