import { Controller, Get, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { EmptyDTO } from "app.dto";
import { AddWatcherDTO } from "game/game.dto";
import { GameService } from "game/game.service";

@Controller('games')
export class GameController {
	constructor(private gameService: GameService) {}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getGames(@Query() query: EmptyDTO) {
		const {  } = query;

		return await this.gameService.getGames();
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get('watchGame')
	addWatcher(@Req() req, @Query() query: AddWatcherDTO) {
		const user = req.user;
		const { gamerLogin } = query;

		return { ok: this.gameService.addWatcher(user.id, gamerLogin) };
	}
}
