import { ChannelEntity } from "channel/entities/channel.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "users/entities/user.entity";

@Entity({ name: 'channel_members' })
export class ChannelMemberEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	channelId: number;

	@ManyToOne(() => ChannelEntity, channel => channel.members)
	@JoinColumn({ name: 'channelId' })
	channel: ChannelEntity;

	@Column()
	userId: number;

	@ManyToOne(() => User, user => user.channels)
	@JoinColumn({ name: 'userId' })
	user: User;
}
