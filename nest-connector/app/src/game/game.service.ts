import { Injectable } from '@nestjs/common';
import { Game as G } from './game.interface';

@Injectable()
export class GameService {
  private pointsForWin: number;
  private ballSpeed: number;
  private playerOne: G;
  private playerTwo: G;
  private map: any;
  private BallPosX: number;
  private BallPosY: number;
  constructor(
    platformWide = 150,
    pointsForWin = 3,
    map = null,
    basePlatformSpeed = 1,
    ballSpeed = 1.3,
  ) {
    this.pointsForWin = pointsForWin;
    this.map = map;
    this.playerOne.gamePoints = this.playerTwo.gamePoints = 0;
    this.playerOne.position = this.playerTwo.position = 50;
    this.playerOne.platformSpeed = this.playerTwo.platformSpeed =
      basePlatformSpeed;
    this.playerOne.platformWide = this.playerTwo.platformWide = platformWide;
    this.BallPosX = this.playerTwo.position;
    this.BallPosY = 1;
    this.ballSpeed = ballSpeed;
  }
}
