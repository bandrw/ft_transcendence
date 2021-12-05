import { ChannelEntity } from "channel/entities/channel.entity";
import { ChatEntity } from "chat/chat.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

@Entity({ name: 'ban_lists' })
export class BanListsEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	initiatorId: number;

	@ManyToOne(() => User, user => user.bannedList)
	initiator: User;

	@Column()
	memberId: number;

	@ManyToOne(() => User, user => user.banLists)
	member: User;

	@Column()
	chatId: number;

	@ManyToOne(() => ChatEntity, chat => chat.banLists)
	chat: ChatEntity;

	@Column()
	channelId: number;

	@ManyToOne(() => ChannelEntity, channel => channel.banLists)
	channel: ChannelEntity;

	@Column({ type: "timestamp" })
	unbanDate: Date;
}
