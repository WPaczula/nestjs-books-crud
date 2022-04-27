import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class PatchBookDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  receivedAt: Date | null;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readAt: Date | null;

  @IsBoolean()
  @IsOptional()
  reviewed: boolean;
}
