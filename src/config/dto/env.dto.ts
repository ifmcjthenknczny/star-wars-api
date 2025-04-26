import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class EnvironmentVariables {
  [key: string]: string | number | boolean;

  @IsString()
  @IsNotEmpty()
  API_KEY: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_HOST: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_NAME: string;

  @IsNotEmpty()
  @IsString()
  DATABASE_PASSWORD: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  DATABASE_PORT: number = 5432;

  @IsNotEmpty()
  @IsString()
  DATABASE_USER: string;
}
