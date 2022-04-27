import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookMapper } from './book.mapper';

@Module({
  providers: [BookService, BookMapper],
  controllers: [BookController],
})
export class BookModule {}
