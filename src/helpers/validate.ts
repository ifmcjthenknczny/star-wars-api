import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';

export function validate<T extends Record<string, string | number | boolean>>(
  config: Record<string, unknown>,
  dto: ClassConstructor<T>,
): T {
  const validatedConfig = plainToInstance(dto, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
