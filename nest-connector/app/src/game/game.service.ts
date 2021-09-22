import { Injectable } from '@nestjs/common';
import { Game as G } from './game';

@Injectable()
export class GameService {
  public gamers: G[] = [];
  startGame(Game: G) {
    this.gamers.push(Game);
  }
}
