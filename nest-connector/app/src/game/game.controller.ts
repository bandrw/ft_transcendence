import { Controller, Get, Query } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get('launchBall')
  launchBall(@Query('login') login) {
    this.gameService.launchBall(login);
  }
}
