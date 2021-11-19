import {
	Body,
	Controller, Get,
	Post, Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ExpandDTO } from "app.dto";
import { CreateChannelDTO, JoinChannelDTO } from "channel/channel.dto";
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

		return await this.channelService.createChannel(name, title, user.id, isPrivate, password);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getChannels(@Req() req, @Query() { expand }: ExpandDTO) {
		return await this.channelService.getChannels(isDefined(expand));
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('join')
	async joinChannel(@Req() req, @Body() { channelId }: JoinChannelDTO) {
		const user = req.user;

		return await this.channelService.addMember(channelId, user.id);
	}

}
