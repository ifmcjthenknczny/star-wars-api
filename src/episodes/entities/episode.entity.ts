import { Entity, Column, Unique, PrimaryColumn } from 'typeorm';

@Entity('episodes')
@Unique(['codename', 'episode_number'])
export class Episode {
  @Column()
  @PrimaryColumn()
  codename: string;

  @Column()
  title: string;

  @Column({ type: 'integer', unique: true })
  episode_number?: number;
}
