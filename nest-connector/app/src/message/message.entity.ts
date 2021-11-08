import { ChatEntity } from "chat/chat.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

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
	fromUserId: number;

	@ManyToOne(() => User, user => user.messages)
	@JoinColumn({ name: 'fromUserId' })
	fromUser: User;

	@Column()
	text: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	date: number;
}
