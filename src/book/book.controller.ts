import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TokenUser, UseAuthenticationToken } from 'src/auth/decorators';
import { ITokenUser } from 'src/auth/interfaces';
import { BookService } from './book.service';
import { BookDto, CreateBookDto } from './dtos';
import { PatchBookDto } from './dtos/patchBook.dto';

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
    const { author, publishingHouse, title, receivedAt } = createBookDto;
    const { userId } = user;

    const book = await this.bookService.createBook(
      userId,
      title,
      author,
      publishingHouse,
      receivedAt,
    );

    return new BookDto(
      book.id,
      book.title,
      book.author,
      book.publishingHouse,
      book.receivedAt,
    );
  }

  @Get('/')
  async getBooks(@TokenUser() user: ITokenUser) {
    const books = await this.bookService.getBooks(user.userId);

    return books.map(
      (b) =>
        new BookDto(b.id, b.title, b.author, b.publishingHouse, b.receivedAt),
    );
  }

  @Patch('/:id')
  async patchBook(
    @Param('id') id: string,
    @Body() patchBookDto: PatchBookDto,
    @TokenUser() user: ITokenUser,
  ) {
    const { receivedAt } = patchBookDto;

    const book = await this.bookService.updateReceivedAt(
      id,
      receivedAt,
      user.userId,
    );

    return new BookDto(
      book.id,
      book.title,
      book.author,
      book.publishingHouse,
      book.receivedAt,
    );
  }
}
