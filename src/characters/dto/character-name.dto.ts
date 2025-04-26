import { PickType } from '@nestjs/mapped-types';
import { CreateCharacterDto } from './create-character.dto';

export class CharacterNameDto extends PickType(CreateCharacterDto, [
  'name',
] as const) {}
