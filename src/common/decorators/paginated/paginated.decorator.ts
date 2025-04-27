import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { DEFAULT_VALUES } from 'src/common/dto/pagination.dto';

export const Paginated = () =>
  applyDecorators(
    ApiQuery({
      name: 'perPage',
      required: false,
      type: Number,
      default: DEFAULT_VALUES.perPage,
      description: 'Number of items per page',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      default: DEFAULT_VALUES.page,
      description: 'Page number',
    }),
  );
