import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'type', type: 'varchar', length: 255 })
  type: string;

  @Column({ name: 'tmdb_id', type: 'int' })
  tmdbID: number;

  @Column({ name: 'stream_name', type: 'varchar', length: 255 })
  streamName: string;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'poster', type: 'varchar', length: 255 })
  poster: string;

  @Column({ name: 'backdrop', type: 'varchar', length: 255 })
  backdrop: string;
}
