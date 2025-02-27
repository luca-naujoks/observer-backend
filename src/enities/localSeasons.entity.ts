import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('local_seasons')
export class LocalSeason {
  @PrimaryGeneratedColumn()
  @OneToOne(() => Media)
  @JoinColumn({ name: 'id' })
  id: number;

  @Column({ name: 'season', type: 'int', nullable: false })
  season: number;

  @Column({ name: 'episode', type: 'int', nullable: false })
  episodes: number;

  @Column({ name: 'attention', type: 'int', nullable: false })
  attention: number;
}
