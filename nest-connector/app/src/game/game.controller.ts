import { Controller, Get, Query } from '@nestjs/common';
import { EventsGame } from './events.game';

@Controller('game')
export class GameController {
  constructor(private gameService: EventsGame) {}
}
