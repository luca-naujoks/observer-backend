import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tags')
export class Tags {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stream_name', type: 'varchar', length: 255 })
  streamName: string;

  @Column({ name: 'tag_id', type: 'int' })
  tagID: number;
}
