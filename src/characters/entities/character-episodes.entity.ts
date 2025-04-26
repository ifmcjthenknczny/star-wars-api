import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Episode } from 'src/episodes/entities/episode.entity';
import { CharacterEntity } from './character.entity';

@Entity('character_episodes')
export class CharacterEpisode {
  @PrimaryColumn()
  character_name: string;

  @PrimaryColumn()
  episode: string;

  @ManyToOne(
    () => CharacterEntity,
    (character) => character.characterEpisodes,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'character_name', referencedColumnName: 'name' })
  character: CharacterEntity;

  @ManyToOne(() => Episode, (episode) => episode.codename, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'episode', referencedColumnName: 'codename' })
  episodeEntity: Episode;
}
