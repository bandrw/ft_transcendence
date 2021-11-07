import { ChatEntity } from "chat/chat.entity";
import { GameEntity } from "game/game.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSubscription } from "users/entities/subscription.entity";

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

	@OneToMany(() => UserSubscription, subscription => subscription.user)
	subscriptions: UserSubscription[];

	@OneToMany(() => UserSubscription, subscription => subscription.target)
	subscribers: UserSubscription[];

	@OneToMany(() => ChatEntity, chat => chat.userOne)
	createdChats: ChatEntity[];

	@OneToMany(() => ChatEntity, chat => chat.userTwo)
	acceptedChats: ChatEntity[];
}
