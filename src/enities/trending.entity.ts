import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('trending')
export class Trending {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'media_id', type: 'int', nullable: false })
  media_id: number;

  @Column()
  type: string;
}
