import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ChannelEntity } from "channel/entities/channel.entity";
import { Repository } from "typeorm";

import { ChannelMemberEntity } from "./entities/channelMember.entity";

@Injectable()
export class ChannelService {

	@InjectRepository(ChannelEntity)
	private channelRepository: Repository<ChannelEntity>;

	@InjectRepository(ChannelMemberEntity)
	private channelMemberRepository: Repository<ChannelMemberEntity>;

	async createChannel(name: string, title: string, ownerId: number, isPrivate: boolean, password?: string): Promise<ChannelEntity> {
		try {
			const channel = this.channelRepository.create();
			channel.name = name;
			channel.title = title;
			channel.ownerId = ownerId;
			channel.isPrivate = isPrivate;
			if (password)
				channel.password = password;
			const res = await this.channelRepository.save(channel);
			await this.addMember(res.id, ownerId);
			return res;
		} catch (e) {
			throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
		}
	}

	async addMember(channelId: number, userId: number): Promise<ChannelMemberEntity> {
		const m = await this.channelMemberRepository.findOne({ where: { channelId: channelId, userId: userId } });
		if (m)
			return m;

		try {
			const member = this.channelMemberRepository.create();
			member.channelId = channelId;
			member.userId = userId;
			return await this.channelMemberRepository.save(member);
		} catch (e) {
			throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
		}
	}

	async getChannel(id: number, expand = false): Promise<ChannelEntity> {
		if (expand)
			return await this.channelRepository.findOne({ where: { id: id }, relations: ['owner', 'members', 'messages'] });
		return await this.channelRepository.findOne({ where: { id: id } });
	}

	async getChannels(expand = false): Promise<ChannelEntity[]> {
		if (expand)
			return await this.channelRepository.find({ relations: ['owner', 'members', 'messages'] });
		return await this.channelRepository.find();
	}

}
