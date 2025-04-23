import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CharacterEntity } from './entities/character.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CharacterEntity])],
  controllers: [CharactersController],
  providers: [CharactersService],
})
export class CharactersModule {}
