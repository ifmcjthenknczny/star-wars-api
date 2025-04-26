import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { validate } from 'src/helpers/validate';
import { EnvironmentVariables } from './dto/env.dto';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate: (config) => validate(config, EnvironmentVariables),
    }),
  ],
  providers: [],
})
export class ConfigModule {}
