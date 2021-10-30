import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "users/user.entity";

@Entity({ name: 'games_history' })
export class GameEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.wonGames)
	@JoinColumn({ name: 'winnerId' })
	winner: User;

	@Column()
	winnerId: number;

	@ManyToOne(() => User, user => user.lostGames)
	@JoinColumn({ name: 'loserId' })
	loser: User;

	@Column()
	loserId: number;

	@Column()
	leftScore: number;

	@Column()
	rightScore: number;

	@Column()
	date: number;
}
