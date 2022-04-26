import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TokenUser, UseAuthenticationToken } from 'src/auth/decorators';
import { ITokenUser } from 'src/auth/interfaces';
import { BookService } from './book.service';
import { BookDto, CreateBookDto } from './dtos';

@Controller('books')
@UseAuthenticationToken()
export class BookController {
  constructor(private bookService: BookService) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBookDto: CreateBookDto,
    @TokenUser() user: ITokenUser,
  ) {
    const { author, publishingHouse, title } = createBookDto;
    const { userId } = user;

    const book = await this.bookService.createBook(
      title,
      author,
      publishingHouse,
      userId,
    );

    return new BookDto(book.id, book.title, book.author, book.publishingHouse);
  }

  @Get('/')
  async getBooks(@TokenUser() user: ITokenUser) {
    const books = await this.bookService.getBooks(user.userId);

    return books.map(
      (b) => new BookDto(b.id, b.title, b.author, b.publishingHouse),
    );
  }
}
