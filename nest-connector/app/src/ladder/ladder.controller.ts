import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { FindGameDTO } from "ladder/ladder.dto";
import { LadderService } from 'ladder/ladder.service';

@Controller('ladder')
export class LadderController {
	constructor(private ladder: LadderService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('setStatus')
	findGame(@Req() req, @Query() query: FindGameDTO) {
		const user = req.user;
		const { status } = query;

		this.ladder.updateStatus(user.id, status);
	}

	// @UseGuards(AuthGuard('jwt'))
	// @Get('systemStatus')
	// systemStatus(@Query('login') login) {
	// 	this.ladder.traceLadder(login);
	// }
}
