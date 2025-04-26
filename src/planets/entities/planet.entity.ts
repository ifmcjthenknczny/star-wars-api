import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity('planets')
@Unique(['name'])
export class PlanetEntity {
  @Column()
  @PrimaryColumn()
  name: string;
}
