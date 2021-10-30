import { Controller, Get } from '@nestjs/common';
import { GameService } from "game/game.service";

@Controller('games')
export class GameController {
	constructor(private GameService: GameService) {}

	@Get('/')
	async getGames() {
		return await this.GameService.getGames();
	}

	// @Post('/')
	// async pushGame(@Body() body: CreateGame) {
	// 	if (!body.leftPlayerId || !body.rightPlayerId || !body.winnerId)
	// 		throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
	//
	// 	const leftPlayer = await this.UsersService.findOne(body.leftPlayerId);
	// 	const rightPlayer = await this.UsersService.findOne(body.rightPlayerId);
	// 	const winner = leftPlayer.id === body.winnerId ? leftPlayer : rightPlayer;
	// 	await this.GameService.pushGame(leftPlayer, rightPlayer, winner)
	// 		.catch(e => {
	// 			throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
	// 		});
	// 	return { ok: true, msg: 'GameEntity created' };
	// }
}
