import { Injectable } from '@nestjs/common';
import { BookDto } from './dtos';
import { IBook } from './interfaces/book.interface';

@Injectable()
export class BookMapper {
  toDto(book: IBook): BookDto {
    return new BookDto(
      book.id,
      book.title,
      book.author,
      book.publishingHouse,
      book.receivedAt,
      book.readAt,
      book.reviewed,
    );
  }
}
