import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from "users/entities/user.entity";

@Entity({ name: 'user_subscriptions' })
export class UserSubscription {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, user => user.subscriptions)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column()
	userId: number;

	@ManyToOne(() => User, user => user.subscribers)
	@JoinColumn({ name: 'targetId' })
	target: User;

	@Column()
	targetId: number;
}
