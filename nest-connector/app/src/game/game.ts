import { Gamer as G } from './gamer.interface';

export class Game {
  private pointsForWin: number;
  private ballSpeed: number;
  private map: any;
  private BallPosX: number;
  private BallPosY: number;
  constructor(
    public playerOne: G,
    public playerTwo: G,
    pointsForWin = 3,
    map = null,
    ballSpeed = 1.3,
  ) {
    this.pointsForWin = pointsForWin;
    this.map = map;
    this.BallPosX =
      this.playerTwo.position -
      this.playerTwo.platformWide / 2 +
      this.playerTwo.platformWide * Math.random();
    this.BallPosY = 1;
    this.ballSpeed = ballSpeed;
  }
}
