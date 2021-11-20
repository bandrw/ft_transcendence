import { ChatEntity } from "chat/chat.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

import { ChannelEntity } from "../channel/entities/channel.entity";

@Entity({ name: 'messages' })
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	chatId: number;

	@OneToOne(() => ChatEntity, chat => chat.messages)
	@JoinColumn({ name: 'chatId' })
	chat: ChatEntity;

	@Column()
	channelId: number;

	@OneToOne(() => ChannelEntity, channel => channel.messages)
	@JoinColumn({ name: 'channelId' })
	channel: ChatEntity;

	@Column()
	fromUserId: number;

	@ManyToOne(() => User, user => user.messages)
	@JoinColumn({ name: 'fromUserId' })
	fromUser: User;

	@Column()
	text: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	date: number;
}
