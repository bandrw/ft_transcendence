import { Injectable } from '@nestjs/common';
import { Game as G } from './game';

@Injectable()
export class GameService {
  private gamers: G[] = [];
  startGame(Game: G) {
    this.gamers.push(Game);
  }
  launchBall(login: string) {
    let i = 0;
    while (i < this.gamers.length) {
      if (this.gamers[i].playerTwo.user.login === login) {
      }
      ++i;
    }
  }
}
