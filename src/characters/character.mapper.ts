import { CharacterEntity } from './entities/character.entity';

type Character = { name: string; planet?: string; episodes: string[] };

export const mapCharacterEntityToDto = (
  character: CharacterEntity,
): Character => ({
  name: character.name,
  ...(character.planet ? { planet: character.planet } : {}),
  episodes: character.characterEpisodes?.map((ce) => ce.episode) || [],
});
