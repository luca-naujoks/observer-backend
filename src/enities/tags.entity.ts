import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  @OneToOne(() => Media)
  @JoinColumn({ name: 'id' })
  id: number;

  @Column({ name: 'tag_id', type: 'int', nullable: false })
  tag_id: number;
}
