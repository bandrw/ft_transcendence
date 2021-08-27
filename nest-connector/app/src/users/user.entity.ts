import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User_table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
