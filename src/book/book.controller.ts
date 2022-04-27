import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TokenUser, UseAuthenticationToken } from 'src/auth/decorators';
import { ITokenUser } from 'src/auth/interfaces';
import { BookMapper } from './book.mapper';
import { BookService } from './book.service';
import { BookDto, CreateBookDto } from './dtos';
import { PatchBookDto } from './dtos/patchBook.dto';

@Controller('books')
@UseAuthenticationToken()
export class BookController {
  constructor(
    private bookService: BookService,
    private bookMapper: BookMapper,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBookDto: CreateBookDto,
    @TokenUser() user: ITokenUser,
  ): Promise<BookDto> {
    const { author, publishingHouse, title, receivedAt, readAt, reviewed } =
      createBookDto;
    const { userId } = user;

    const book = await this.bookService.createBook(
      userId,
      title,
      author,
      publishingHouse,
      receivedAt,
      readAt,
      reviewed,
    );

    return this.bookMapper.toDto(book);
  }

  @Get('/')
  async getBooks(
    @TokenUser() user: ITokenUser,
    @Query('receivedFrom') receivedFrom?: string,
    @Query('receivedTo') receivedTo?: string,
  ): Promise<Array<BookDto>> {
    const receivedFromDate = receivedFrom ? new Date(receivedFrom) : undefined;
    const receivedToDate = receivedTo ? new Date(receivedTo) : undefined;

    const books = await this.bookService.getBooks(
      user.userId,
      receivedFromDate,
      receivedToDate,
    );

    return books.map(this.bookMapper.toDto);
  }

  @Patch('/:id')
  async patchBook(
    @Param('id') id: string,
    @Body() patchBookDto: PatchBookDto,
    @TokenUser() user: ITokenUser,
  ): Promise<BookDto> {
    const { receivedAt, reviewed, readAt } = patchBookDto;

    const book = await this.bookService.updateReceivedAt(
      id,
      user.userId,
      receivedAt,
      readAt,
      reviewed,
    );

    return this.bookMapper.toDto(book);
  }
}
