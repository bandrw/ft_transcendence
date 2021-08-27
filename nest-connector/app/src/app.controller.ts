import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
// import chat from '/src/js/chat.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  baseApp(@Res() response: Response) {
    this.appService.baseApp(response);
  }
}