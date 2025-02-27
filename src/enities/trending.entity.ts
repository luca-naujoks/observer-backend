import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity('trending')
export class Trending {
  @PrimaryGeneratedColumn()
  @OneToOne(() => Media)
  @JoinColumn({ name: 'id' })
  id: number;

  @Column()
  type: string;
}
