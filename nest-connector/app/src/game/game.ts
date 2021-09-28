import { Gamer as G } from './gamer.interface';

export class Game {
  public pointsForWin: number;
  private ballSpeed: number;
  private map: any;
  private BallPosX: number;
  private BallPosY: number;
  public starterOne: boolean;
  public starterTwo: boolean;
  constructor(
    public playerOne: G,
    public playerTwo: G,
    public id: number,
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
    if (Math.random() > 0.5) {
      this.starterOne = true;
      this.starterTwo = false;
      this.BallPosY = 97;
    } else {
      this.starterOne = false;
      this.starterTwo = true;
      this.BallPosY = 3;
    }
    this.ballSpeed = ballSpeed;
    this.playerOne.user.resp.write(
      `event: gameSettings\ndata: ${JSON.stringify({
        BallPosX: this.BallPosX,
        BallPosY: this.BallPosY,
        starter: this.starterOne,
        id: this.id,
        enemyGameSettings: {
          platformWide: this.playerTwo.platformWide,
          platformSpeed: this.playerTwo.platformSpeed,
        },
      })}\n\n`,
    );
    this.playerTwo.user.resp.write(
      `event: gameSettings\ndata: ${JSON.stringify({
        BallPosX: this.BallPosX,
        BallPosY: this.BallPosY,
        starter: this.starterTwo,
        id: this.id,
        enemyGameSettings: {
          platformWide: this.playerOne.platformWide,
          platformSpeed: this.playerOne.platformSpeed,
        },
      })}\n\n`,
    );
    this.playerOne.gamePoints = 0;
    this.playerTwo.gamePoints = 0;
  }
}
