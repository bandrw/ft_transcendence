import { Controller, Get, Res, Query, Post, Param, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private UsersService: UsersService) {}

  @Post('create')
  async createUser(@Req() req: Request, @Res() res: Response) {
    const bad = ' /|;<>&?:{}[]()';
    for (let i = 0; i < req.body.login.length; i++) {
      for (let k = 0; k < bad.length; k++) {
        if (req.body.login[i] === bad[k]) {
          res.send(bad[k]);
          return;
        }
      }
    }
    res.send(true);
    await this.UsersService.create(req.body.login, req.body.pass);
  }
  @Get('getAll')
  getUsers(@Res() res: Response) {
    this.UsersService.findAll(res);
  }
  @Get('del')
  delUser(@Query('id') id) {
    this.UsersService.remove(id);
  }
  @Get('avatar')
  async updateAvatar(@Query('login') login): Promise<string> {
    return await this.UsersService.updateAvatar(login);
  }
  @Post(':login')
  async authentification(@Param() params, @Res() response: Response) {
    response.send(await this.UsersService.findOne(params.login));
  }
}
