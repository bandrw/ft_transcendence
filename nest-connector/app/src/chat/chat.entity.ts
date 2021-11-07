import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

@Entity({ name: 'chats' })
export class ChatEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userOneId: number;

	@ManyToOne(() => User, user => user.createdChats)
	@JoinColumn({ name: 'userOneId' })
	userOne: User

	@Column()
	userTwoId: number;

	@ManyToOne(() => User, user => user.acceptedChats)
	@JoinColumn({ name: 'userTwoId' })
	userTwo: User
}
