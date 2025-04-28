import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from './entities/character.entity';
import { CharacterEpisodeEntity } from './entities/character-episodes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CharacterEntity]),
    TypeOrmModule.forFeature([CharacterEpisodeEntity]),
  ],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
