import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('provider')
export class Provider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column()
  enabled: boolean;
}
