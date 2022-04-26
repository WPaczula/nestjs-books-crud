import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class PatchBookDto {
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  receivedAt: Date | null;
}
