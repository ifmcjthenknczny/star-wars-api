import { Optional } from '@nestjs/common';
import { Entity, Column, Unique, PrimaryColumn, OneToMany } from 'typeorm';
import { CharacterEpisode } from './character-episodes.entity';

@Entity('characters')
@Unique(['name'])
export class CharacterEntity {
  @Column()
  @PrimaryColumn()
  name: string;

  @Column()
  @Optional()
  planet: string;

  @OneToMany(
    () => CharacterEpisode,
    (characterEpisode) => characterEpisode.character,
  )
  characterEpisodes: CharacterEpisode[];
}
