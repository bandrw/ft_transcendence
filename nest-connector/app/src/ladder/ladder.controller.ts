import { Controller, Get, Query } from '@nestjs/common';
import { LadderService } from 'ladder/ladder.service';


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
}
