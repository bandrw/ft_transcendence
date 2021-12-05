import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { BanListsEntity } from "ban-lists/ban-lists.entity";
import { Repository } from "typeorm";

@Injectable()
export class BanListsService {

	@InjectRepository(BanListsEntity)
	private banListsRepository: Repository<BanListsEntity>;

	async muteMember(channelId: number, initiatorId: number, memberId: number, unbanDate: string | null) {
		try {
			const ban = this.banListsRepository.create();
			ban.initiatorId = initiatorId;
			ban.memberId = memberId;
			ban.channelId = channelId;
			ban.unbanDate = new Date(unbanDate);
			return await this.banListsRepository.save(ban);
		} catch (e) {
			console.log('[muteMember error]', e, e.detail);
			throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
		}
	}

}
