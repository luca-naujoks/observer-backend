import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'media_id', type: 'int', nullable: false, unique: false })
  media_id: number;

  @Column({ name: 'tag_id', type: 'int', nullable: false })
  tag_id: number;
}
