import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { LadderService } from 'ladder/ladder.service';


@Controller('ladder')
export class LadderController {
  constructor(private ladder: LadderService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('gameStatus')
  findGame(@Query('login') login, @Query('status') status) {
    this.ladder.updateStatus(login, status);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('systemStatus')
  systemStatus(@Query('login') login) {
    this.ladder.traceLadder(login);
  }
}
