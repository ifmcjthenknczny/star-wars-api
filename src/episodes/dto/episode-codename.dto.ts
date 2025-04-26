import { PickType } from '@nestjs/mapped-types';
import { CreateEpisodeDto } from './create-episode.dto';

export class EpisodeCodenameDto extends PickType(CreateEpisodeDto, [
  'codename',
] as const) {}
