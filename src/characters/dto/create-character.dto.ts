import { Trim } from 'src/common/decorators/trim/trim.decorator';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCharacterDto {
  @Trim()
  @IsString({
    message: 'Character name must be a string.',
  })
  @IsNotEmpty({
    message: 'Character name should not be empty.',
  })
  @ApiProperty({
    example: 'James Lovelock',
    description: 'Name of character',
    minLength: 1,
    maxLength: 255,
  })
  name: string;

  @Trim()
  @IsOptional()
  @IsString({
    message: 'Character planet must be a string.',
  })
  @ApiProperty({
    example: 'Earth',
    description: `Name of character home planet`,
    required: false,
    minLength: 1,
    maxLength: 255,
  })
  planet?: string;

  @IsArray()
  @IsString({
    each: true,
    message: 'Episodes must be an array of strings.',
  })
  @IsNotEmpty({
    each: true,
    message: 'Episodes should not be empty.',
  })
  @ApiProperty({
    example: ['PHANTOM', 'CLONES'],
    description: `Codename of episodes character has been in`,
    minLength: 1,
  })
  episodes: string[];
}
