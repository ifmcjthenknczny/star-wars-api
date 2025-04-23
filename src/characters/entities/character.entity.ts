import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('characters')
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  planet_id: number;
}
