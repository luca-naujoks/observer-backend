import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('local_seasons')
export class LocalSeasons {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stream_name', type: 'varchar', length: 255 })
  streamName: string;

  @Column({ name: 'season', type: 'int' })
  season: number;

  @Column({ name: 'episode', type: 'int' })
  episodes: number;

  @Column({ name: 'attention', type: 'int' })
  attention: number;
}
