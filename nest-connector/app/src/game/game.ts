import { Gamer as G } from './gamer.interface';

export class Game {
  public pointsForWin: number;
  // private ballSpeed: number;
  // private map: any;
  // private BallPosX: number;
  // private BallPosY: number;
  // public starterOne: boolean;
  // public starterTwo: boolean;
  public readonly fps = 60;
  public gameInterval: NodeJS.Timer;
  public readonly coordinates = {
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
  private gameSettings = {
    canvasWidth: 1024,
    canvasHeight: 600,
    playerWidth: 15,
    playerMargin: 15,
    playerHeight: 150,
    playerStep: 3,
    ballSize: 15,
    ballAngle: 0,
    ballSpeed: 4,
  };
  private score = {
    leftPlayer: 0,
    rightPlayer: 0
  }

  constructor(
    public playerOne: G,
    public playerTwo: G,
    public id: number,
    pointsForWin = 3,
    map = null,
    ballSpeed = 1.3,
  ) {
    this.pointsForWin = pointsForWin;
    // this.map = map;
    // this.BallPosX =
    //   this.playerTwo.position -
    //   this.playerTwo.platformWide / 2 +
    //   this.playerTwo.platformWide * Math.random();
    // if (Math.random() > 0.5) {
    //   this.starterOne = true;
    //   this.starterTwo = false;
    //   this.BallPosY = 97;
    // } else {
    //   this.starterOne = false;
    //   this.starterTwo = true;
    //   this.BallPosY = 3;
    // }
    // this.ballSpeed = ballSpeed;
    const gameSettingsMsg = `event: gameSettings\ndata: ${JSON.stringify({
      id: this.id,
    })}\n\n`;
    this.playerOne.user.resp.write(gameSettingsMsg);
    this.playerTwo.user.resp.write(gameSettingsMsg);
    this.playerOne.gamePoints = 0;
    this.playerTwo.gamePoints = 0;
    this.resetPositions(true);
  }

  resetPositions(withPlatforms = false) {
    if (withPlatforms) {
      this.coordinates.leftPlayer.y = Math.round((this.gameSettings.canvasHeight - this.gameSettings.playerHeight) / 2);
      this.coordinates.rightPlayer.y = Math.round((this.gameSettings.canvasHeight - this.gameSettings.playerHeight) / 2);
    }
    this.coordinates.ball.x = Math.round((this.gameSettings.canvasWidth - this.gameSettings.ballSize) / 2);
    this.coordinates.ball.y = Math.round(Math.random() * (this.gameSettings.canvasHeight - this.gameSettings.ballSize));
    this.gameSettings.ballAngle = (Math.random() * Math.PI / 2) - Math.PI / 4;
    if (Math.random() < 0.5)
      this.gameSettings.ballAngle += Math.PI;
  }

  private sendMsg(event: string, data: string) {
    const scoreMsg = `event: ${event}\ndata: ${data}\n\n`;
    this.playerOne.user.resp.write(scoreMsg);
    this.playerTwo.user.resp.write(scoreMsg);
    // ... and other watchers
  }

  updatePositions() {
    // Score
    if (this.coordinates.ball.x < 0 - this.gameSettings.ballSize) {
      ++this.score.rightPlayer;
      this.sendMsg('gameScore', JSON.stringify(this.score));
      this.resetPositions();
      this.sendMsg('playSound', 'pong-sound-3');
    }
    if (this.coordinates.ball.x > this.gameSettings.canvasWidth) {
      ++this.score.leftPlayer;
      this.sendMsg('gameScore', JSON.stringify(this.score));
      this.resetPositions();
      this.sendMsg('playSound', 'pong-sound-3');
    }

    // Ball bouncing
    const bounceOffTheNorthWall = this.coordinates.ball.y + this.gameSettings.ballSize > this.gameSettings.canvasHeight;
    const bounceOffTheSouthWall = this.coordinates.ball.y < 0;
    if (bounceOffTheNorthWall || bounceOffTheSouthWall)
    {
      if (bounceOffTheNorthWall)
        this.gameSettings.ballAngle = -this.gameSettings.ballAngle;
      if (bounceOffTheSouthWall)
        this.gameSettings.ballAngle = -this.gameSettings.ballAngle;
      this.sendMsg('playSound', 'pong-sound-1');
    }

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
    const bounceOffTheLeftPlayer = this.coordinates.ball.x <= this.gameSettings.playerMargin + this.gameSettings.playerWidth &&
      this.coordinates.ball.y + this.gameSettings.ballSize >= this.coordinates.leftPlayer.y &&
      this.coordinates.ball.y < this.coordinates.leftPlayer.y + this.gameSettings.playerHeight;
    const bounceOffTheRightPlayer = this.coordinates.ball.x >= this.gameSettings.canvasWidth - this.gameSettings.playerMargin - this.gameSettings.playerWidth - this.gameSettings.ballSize &&
      this.coordinates.ball.y + this.gameSettings.ballSize >= this.coordinates.rightPlayer.y &&
      this.coordinates.ball.y < this.coordinates.rightPlayer.y + this.gameSettings.playerHeight;
    if (bounceOffTheLeftPlayer || bounceOffTheRightPlayer) {
      let k;
      if (bounceOffTheLeftPlayer)
        k = (this.coordinates.ball.y + this.gameSettings.ballSize / 2 - this.coordinates.leftPlayer.y) / this.gameSettings.playerHeight;
      else
        k = (this.coordinates.ball.y + this.gameSettings.ballSize / 2 - this.coordinates.rightPlayer.y) / this.gameSettings.playerHeight;
      if (k >= 0 && k < 1 / 8)
        this.gameSettings.ballAngle = -Math.PI / 4;
      else if (k >= 1 / 8 && k < 2 / 8)
        this.gameSettings.ballAngle = -Math.PI / 6;
      else if (k >= 2 / 8 && k < 3 / 8)
        this.gameSettings.ballAngle = -Math.PI / 12;
      else if (k >= 3 / 8 && k < 5 / 8)
        this.gameSettings.ballAngle = 0;
      else if (k >= 5 / 8 && k < 6 / 8)
        this.gameSettings.ballAngle = Math.PI / 12;
      else if (k >= 6 / 8 && k < 7 / 8)
        this.gameSettings.ballAngle = Math.PI / 6;
      else if (k >= 7 / 8 && k < 8 / 8)
        this.gameSettings.ballAngle = Math.PI / 4;
      if (bounceOffTheRightPlayer)
        this.gameSettings.ballAngle = Math.PI - this.gameSettings.ballAngle;
      this.sendMsg('playSound', 'pong-sound-2');
    }
  }
}
