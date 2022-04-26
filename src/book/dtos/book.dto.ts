import { IsDateString, IsOptional, IsString } from 'class-validator';

export class BookDto {
  constructor(
    id: string,
    title: string,
    author: string,
    publishingHouse: string,
    receivedAt: Date | null,
  ) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.publishingHouse = publishingHouse;
    this.receivedAt = receivedAt && receivedAt.toISOString();
  }

  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publishingHouse: string;

  @IsDateString()
  @IsOptional()
  receivedAt: string | null;
}
