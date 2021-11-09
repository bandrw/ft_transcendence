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

  @Column({ name: 'score_one', default: 0 })
  score_one: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_two_id' })
  userTwo: User;

  @Column({ name: 'score_two', default: 0 })
  score_two: number;

  @Column()
  winner_id: number;

  @Column({ default: new Date(Date.now()) })
  data: Date;
}
