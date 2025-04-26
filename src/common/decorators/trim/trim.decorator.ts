import { Transform } from 'class-transformer';

export const Trim = <T>() => {
  return Transform(
    ({ value }: { value: T }): T =>
      typeof value === 'string' ? (value.trim() as T) : value,
  );
};
