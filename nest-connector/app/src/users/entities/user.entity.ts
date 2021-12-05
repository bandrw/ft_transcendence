import { BanListsEntity } from "ban-lists/ban-lists.entity";
import { ChannelEntity } from "channel/entities/channel.entity";
import { ChatEntity } from "chat/chat.entity";
import { GameEntity } from "game/game.entity";
import { MessageEntity } from "message/message.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserSubscription } from "users/entities/subscription.entity";

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	password?: string;

	@Column()
	url_avatar: string;

	@Column()
	intraLogin: string;

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

	@OneToMany(() => MessageEntity, message => message.fromUser)
	messages: MessageEntity[];

	@OneToMany(() => ChannelEntity, channel => channel.owner)
	ownedChannels: ChannelEntity[];

	@ManyToMany(() => ChannelEntity, channel => channel.members)
	channels: ChannelEntity[];

	@OneToMany(() => BanListsEntity, banList => banList.initiator)
	bannedList: BanListsEntity[];

	@OneToMany(() => BanListsEntity, banList => banList.member)
	banLists: BanListsEntity[];

	isAdmin: boolean;
}
