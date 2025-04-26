import { Transform, TransformFnParams } from 'class-transformer';

export function Default<T>(defaultValue: T) {
  return Transform(({ value }: TransformFnParams): T => value ?? defaultValue);
}
