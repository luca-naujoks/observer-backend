import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('watchlist')
export class WatchlistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'media_id', type: 'int', nullable: false })
  media_id: number;

  @Column({ name: 'user', type: 'int', nullable: false })
  user: number;
}
