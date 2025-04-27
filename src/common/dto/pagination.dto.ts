import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, Max } from 'class-validator';
import { Default } from '../decorators/default/default.decorator';

export const DEFAULT_VALUES: { perPage: number; page: number } = {
  page: 1,
  perPage: 10,
};

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Default(DEFAULT_VALUES.page)
  page: number = DEFAULT_VALUES.page;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @Default(DEFAULT_VALUES.perPage)
  perPage: number = DEFAULT_VALUES.perPage;
}
