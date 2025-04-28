import { applyDecorators, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const Throttled = (limit: number = 10, ttl: number = 60000) => {
  return applyDecorators(
    Throttle({ default: { limit, ttl } }),
    UseGuards(ThrottlerGuard),
    ApiResponse({
      status: HttpStatus.TOO_MANY_REQUESTS,
      description: 'Too Many Requests',
      schema: {
        example: { message: 'ThrottlerException: Too Many Requests' },
      },
    }),
  );
};
