import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class GameHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_one_id' })
  userOne: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_two_id' })
  userTwo: User;

  @Column()
  winner_id: number;

  @Column({ default: new Date(Date.now()) })
  data: Date;
}
