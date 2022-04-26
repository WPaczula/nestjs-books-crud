import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { TokenUser, UseAuthenticationToken } from 'src/auth/decorators';
import { ITokenUser } from 'src/auth/interfaces';
import { BookService } from './book.service';
import { CreateBookDto } from './dtos';

@Controller('book')
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

    return await this.bookService.createBook(
      title,
      author,
      publishingHouse,
      userId,
    );
  }
}
