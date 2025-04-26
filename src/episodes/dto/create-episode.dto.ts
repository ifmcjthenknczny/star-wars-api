import { Trim } from 'src/common/decorators/trim/trim.decorator';
import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateEpisodeDto {
  @Trim()
  @IsString({
    message: 'Episode codename must be a string.',
  })
  @IsNotEmpty({
    message: 'Episode codename should not be empty.',
  })
  @ApiProperty({
    example: 'CLONES',
    description: 'Codename of Star Wars episode',
  })
  codename: string;

  @Trim()
  @IsString({
    message: 'Title must be a string.',
  })
  @IsNotEmpty({
    message: 'Title should not be empty.',
  })
  @ApiProperty({
    example: 'Attack of the Clones',
    description: 'Title of Star Wars episode',
  })
  @IsString()
  title: string;

  @IsInt({
    message: 'Episode number must be an integer.',
  })
  @IsPositive({
    message: 'Episode number must be positive number.',
  })
  @IsOptional()
  @ApiProperty({
    example: 'CLONES',
    description: 'Codename of Star Wars episode',
  })
  episode_number?: number;
}
