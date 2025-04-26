import { applyDecorators } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiSecurity } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key/api-key.guard';

export function Protected() {
  const decorators = [
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
  ];

  if (process.env.NODE_ENV === 'production') {
    decorators.push(
      (
        target: object,
        propertyKey?: string | symbol,
        descriptor?: PropertyDescriptor,
      ) => {
        ApiExcludeEndpoint()(target, propertyKey!, descriptor!);
      },
    );
  }

  return applyDecorators(...decorators);
}
