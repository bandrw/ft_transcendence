import { Controller, Get, Query } from '@nestjs/common';
import { LadderService } from './ladder.service';

@Controller('ladder')
export class LadderController {
  constructor(private ladder: LadderService) {}

  @Get('findGame')
  findGame(@Query('login') login, @Query('status') status) {
    return this.ladder.updateStatus(login, status);
  }

  @Get('systemStatus')
  systemStatus(@Query('login') login) {
    return this.ladder.traceLadder(login);
  }

  // @Get('gameAccept')
  // gameAccept(@Query('login') login) {
  //
  // }
}
