import { Gamer as G } from './gamer.interface';

export class Game {
  public pointsForWin: number;
  private ballSpeed: number;
  private map: any;
  private BallPosX: number;
  private BallPosY: number;
  public starterOne: boolean;
  public starterTwo: boolean;
  public readonly fps = 60;
  public gameInterval: NodeJS.Timer;
  public coordinates = {
    leftPlayer: {
      x: 0,
      y: 0,
    },
    rightPlayer: {
      x: 0,
      y: 0,
    },
    ball: {
      x: 0,
      y: 0,
    },
  };
  public gameSettings = {
    canvasWidth: 1024,
    canvasHeight: 600,
    playerWidth: 15,
    playerMargin: 15,
    playerHeight: 150,
    playerStep: 3,
    ballSize: 15,
    ballAngle: (Math.random() * Math.PI / 2) - Math.PI / 4,
    ballSpeed: 3,
  };

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

    this.coordinates.leftPlayer.y = Math.round(
      (this.gameSettings.canvasHeight - this.gameSettings.playerHeight) / 2,
    );
    this.coordinates.rightPlayer.y = Math.round(
      (this.gameSettings.canvasHeight - this.gameSettings.playerHeight) / 2,
    );
    this.coordinates.ball.x = Math.round(
      (this.gameSettings.canvasWidth - this.gameSettings.ballSize) / 2,
    );
    this.coordinates.ball.y = Math.round(
      (this.gameSettings.canvasHeight - this.gameSettings.ballSize) / 2,
    );
    if (Math.round(Math.random() * 10) % 2 === 0)
      this.gameSettings.ballAngle += Math.PI;
  }

  updatePositions() {
    // // if (ball.xPosition <= winMargin)
    // // 	props.setEnemyScore((prev) => prev + 1)
    // // else if (ball.xPosition + ball.size >= canvas.width - winMargin)
    // // 	props.setPlayerScore((prev) => prev + 1)

    // Ball bouncing
    if (this.coordinates.ball.x < 0)
      this.gameSettings.ballAngle = Math.PI - this.gameSettings.ballAngle;
    if (this.coordinates.ball.x + this.gameSettings.ballSize > this.gameSettings.canvasWidth)
      this.gameSettings.ballAngle = Math.PI - this.gameSettings.ballAngle;
    if (this.coordinates.ball.y + this.gameSettings.ballSize > this.gameSettings.canvasHeight)
      this.gameSettings.ballAngle = -this.gameSettings.ballAngle;
    if (this.coordinates.ball.y < 0)
      this.gameSettings.ballAngle = -this.gameSettings.ballAngle;

    // Ball moving
    this.coordinates.ball.x += Math.cos(this.gameSettings.ballAngle) * this.gameSettings.ballSpeed;
    this.coordinates.ball.y += Math.sin(this.gameSettings.ballAngle) * this.gameSettings.ballSpeed;

    // PlayerOne moving
    if (this.playerOne.controls.arrowUp && this.coordinates.leftPlayer.y >= this.gameSettings.playerStep)
      this.coordinates.leftPlayer.y -= this.gameSettings.playerStep;
    if (this.playerOne.controls.arrowDown && this.coordinates.leftPlayer.y < this.gameSettings.canvasHeight - this.gameSettings.playerHeight)
      this.coordinates.leftPlayer.y += this.gameSettings.playerStep;

    // PlayerTwo moving
    if (this.playerTwo.controls.arrowUp && this.coordinates.rightPlayer.y >= this.gameSettings.playerStep)
      this.coordinates.rightPlayer.y -= this.gameSettings.playerStep;
    if (this.playerTwo.controls.arrowDown && this.coordinates.rightPlayer.y < this.gameSettings.canvasHeight - this.gameSettings.playerHeight)
      this.coordinates.rightPlayer.y += this.gameSettings.playerStep;

    // Ball collision with platforms
    if (this.coordinates.ball.x <= this.gameSettings.playerMargin + this.gameSettings.playerWidth &&
        this.coordinates.ball.y + this.gameSettings.ballSize >= this.coordinates.leftPlayer.y &&
        this.coordinates.ball.y < this.coordinates.leftPlayer.y + this.gameSettings.playerHeight)
      this.gameSettings.ballAngle = Math.PI - this.gameSettings.ballAngle;
    else if (this.coordinates.ball.x >= this.gameSettings.canvasWidth - this.gameSettings.playerMargin - this.gameSettings.playerWidth - this.gameSettings.ballSize &&
        this.coordinates.ball.y + this.gameSettings.ballSize >= this.coordinates.rightPlayer.y &&
        this.coordinates.ball.y < this.coordinates.rightPlayer.y + this.gameSettings.playerHeight)
      this.gameSettings.ballAngle = Math.PI - this.gameSettings.ballAngle;
  }
}
