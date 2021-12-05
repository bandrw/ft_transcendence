import {
	Body,
	Controller, Get,
	Post, Put, Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ExpandDTO } from "app.dto";
import { CreateChannelDTO, JoinChannelDTO, MuteMemberDTO, UpdateMemberStatusDTO } from "channel/channel.dto";
import { ChannelService } from "channel/channel.service";
import { isDefined } from "class-validator";

@Controller('channels')
export class ChannelController {

	constructor(private channelService: ChannelService) {}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('create')
	async createChannel(@Req() req, @Body() { name, title, isPrivate, password }: CreateChannelDTO) {
		const user = req.user;

		// todo [name validation]
		return await this.channelService.createChannel(name, title, user.id, isPrivate, password);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getChannels(@Req() req, @Query() { expand }: ExpandDTO) {
		const { user } = req;

		return await this.channelService.getChannels(user.id, isDefined(expand));
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('join')
	async joinChannel(@Req() req, @Body() { channelId, password }: JoinChannelDTO) {
		const user = req.user;

		return await this.channelService.addMember(channelId, user.id, password);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Put('updateMemberStatus')
	async updateMemberStatus(@Req() req, @Body() { channelId, memberId, status }: UpdateMemberStatusDTO) {
		const user = req.user;

		return await this.channelService.updateMemberStatus(user.id, channelId, memberId, status);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('muteMember')
	async muteMember(@Req() req, @Body() { channelId, memberId, unbanDate }: MuteMemberDTO) {
		const user = req.user;

		return await this.channelService.muteMember(user.id, channelId, memberId, unbanDate);
	}

}
