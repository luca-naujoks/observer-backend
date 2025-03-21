import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('local_seasons')
export class LocalSeason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'media_id', type: 'int', nullable: false })
  media_id: number;

  @Column({ name: 'season', type: 'int', nullable: false })
  season: number;

  @Column({ name: 'episode', type: 'int', nullable: false })
  episode: number;

  @Column({ name: 'attention', type: 'boolean', nullable: false })
  attention: boolean;
}
