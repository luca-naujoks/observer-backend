import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('trending')
export class Trending {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stream_name', type: 'varchar', length: 255 })
  streamName: string;
}
