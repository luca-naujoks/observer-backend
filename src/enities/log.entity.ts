import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  // timestamp
  @Column({ name: 'timestamp', type: 'date', nullable: false, unique: false })
  timestamp: Date;

  // type: info, warning, error
  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: string;

  // user that executed the process for now system till real user management is implemented
  @Column({ name: 'user', type: 'varchar', nullable: true })
  user: string;

  // message: error message or additional info
  @Column({ name: 'message', type: 'varchar', nullable: true })
  message: string;
}
