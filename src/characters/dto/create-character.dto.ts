import { Trim } from 'src/helpers/decorators';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @Trim()
  @IsString({
    message:
      'Character name must be a string. Ensure that name is a valid string.',
  })
  @IsNotEmpty({
    message: 'Character name should not be empty. Please provide a valid name.',
  })
  @ApiProperty({
    example: 'James Lovelock',
    description: 'Name of character',
  })
  name: string;

  @Trim()
  @IsOptional()
  @IsInt({
    message:
      'Character planet id must be an integer. Ensure that planet id is a valid integer.',
  })
  planetId: string;

  @IsArray()
  @IsInt({
    each: true,
    message:
      'Episode ids must be an array of integers. Ensure that every element is a valid integer.',
  })
  @IsNotEmpty({
    each: true,
    message:
      'Episode ids should not be empty. Please provide valid episode ids.',
  })
  episodeIds: string[];
}
