import {
	Body,
	Controller,
	Post,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { CreateChannelDTO, JoinChannelDTO } from "channel/channel.dto";
import { ChannelService } from "channel/channel.service";

@Controller('channel')
export class ChannelController {

	constructor(private channelService: ChannelService) {}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('create')
	async createChannel(@Req() req, @Body() body: CreateChannelDTO) {
		const { name, title, isPrivate, password } = body;
		const user = req.user;

		return await this.channelService.createChannel(name, title, user.id, isPrivate, password);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('join')
	async joinChannel(@Req() req, @Body() body: JoinChannelDTO) {
		const user = req.user;
		const { channelId } = body;

		return await this.channelService.addMember(channelId, user.id);
	}

}
