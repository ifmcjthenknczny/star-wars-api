import { Trim } from 'src/common/decorators/trim/trim.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlanetNameDto {
  @Trim()
  @IsString({
    message: 'Planet name must be a string.',
  })
  @IsNotEmpty({
    message: 'Planet name should not be empty.',
  })
  @ApiProperty({
    example: 'Earth',
    description: 'Name of planet',
  })
  name: string;
}
