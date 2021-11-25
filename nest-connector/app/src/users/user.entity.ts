import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password?: string;

  @Column()
  url_avatar: string;

  @Column({ default: 0 })
  games: number;

  @Column({ default: 0 })
  wins: number;
}
