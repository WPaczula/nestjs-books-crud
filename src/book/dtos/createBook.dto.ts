import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

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

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readAt?: Date;

  @IsOptional()
  @IsBoolean()
  reviewed?: boolean;
}
