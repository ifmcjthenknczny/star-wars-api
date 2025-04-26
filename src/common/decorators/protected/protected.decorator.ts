import { applyDecorators } from '@nestjs/common';
import { ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

export function Protected() {
  return applyDecorators(
    ApiHeader({
      name: 'x-api-key',
      description: 'API key to authorize the request',
      required: true,
    }),
    ApiSecurity('x-api-key'),
    UseGuards(ApiKeyGuard),
    ApiResponse({
      status: 403,
      description: 'Invalid API key',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Forbidden: Invalid API key',
              },
              error: { type: 'string', example: 'Forbidden' },
              statusCode: { type: 'number', example: 403 },
            },
          },
        },
      },
    }),
  );
}
