import { IsString } from 'class-validator';

export class BookDto {
  constructor(
    id: string,
    title: string,
    author: string,
    publishingHouse: string,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.publishingHouse = publishingHouse;
  }

  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publishingHouse: string;
}
