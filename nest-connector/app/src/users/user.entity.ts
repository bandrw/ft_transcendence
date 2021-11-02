import { GameEntity } from "game/game.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	password: string;

	@Column()
	url_avatar: string;

	@OneToMany(() => GameEntity, game => game.winner)
	wonGames: GameEntity[];

	@OneToMany(() => GameEntity, game => game.loser)
	lostGames: GameEntity[];
}
