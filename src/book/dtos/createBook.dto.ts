import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  publishingHouse: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  receivedAt?: Date;
}
