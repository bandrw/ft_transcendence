import { Column, Entity, JoinColumn, JoinTable,ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

@Entity({ name: 'channels' })
export class ChannelEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	title: string;

	@Column()
	isPrivate: boolean;

	@Column()
	password: string;

	@Column()
	ownerId: number;

	@ManyToOne(() => User, user => user.ownedChannels)
	@JoinColumn({ name: 'ownerId' })
	owner: User;

	@ManyToMany(() => User, user => user.channels)
	@JoinTable({
		name: 'channel_members',
		joinColumn: { name: 'channelId', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
	})
	members: User[];
}
