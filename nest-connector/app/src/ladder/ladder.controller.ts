import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { LadderService } from './ladder.service';
import { Request } from 'express';

@Controller('ladder')
export class LadderController {
  constructor(private ladder: LadderService) {}

  @Get('gameStatus')
  findGame(@Query('login') login, @Query('status') status) {
    this.ladder.updateStatus(login, status);
  }

  @Get('systemStatus')
  systemStatus(@Query('login') login) {
    this.ladder.traceLadder(login);
  }
  @Post('logout')
  userLogout(@Req() req: Request) {
    this.ladder.logout(req.body.user.login);
  }
}
