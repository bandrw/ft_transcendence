import {
  Controller,
  Get,
  Res,
  Query,
  Post,
  Req,
  Header,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';
import { OnlineUser } from './users.interface';
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
  async getUsers(@Res() res: Response) {
    return await this.UsersService.findAll(res);
  }
  @Get('getOnline')
  getOnline(@Res() response: Response) {
    response.send(
      this.UsersService.onlineUsers.map(function (e) {
        if (e) {
          return {
            login: e.login,
            url_avatar: e.url_avatar,
            status: e.status,
            games: e.games,
            wins: e.wins,
            history: e.history,
          };
        } else {
          return null;
        }
      }),
    );
  }
  @Get('del')
  async delUser(@Query('id') id) {
    await this.UsersService.remove(id);
  }
  @Get('avatar')
  async updateAvatar(@Query('login') login): Promise<string> {
    return await this.UsersService.updateAvatar(login);
  }

  @Get('checkExist')
  async checkExist(@Query('login') login) {
    return await this.UsersService.usersRepository.findOne({
      where: { login: login },
    });
  }

  @Get('login')
  @Header('Content-Type', 'text/event-stream')
  @Header('Transfer-Encoding', 'chunked')
  @HttpCode(200)
  emitter(
    @Req() req: Request,
    @Query('login') login,
    @Res() response: Response,
  ) {
    req.socket.setTimeout(1000 * 60 * 60 * 60);
    let i = 0;
    while (i < this.UsersService.onlineUsers.length) {
      if (
        this.UsersService.onlineUsers &&
        this.UsersService.onlineUsers[i].login === login
      ) {
        this.UsersService.onlineUsers[i].resp = response;
        this.UsersService.onlineUsers[i].status = 'green';
        this.UsersService.userEvent('login', this.UsersService.onlineUsers[i]);
        return;
      }
      ++i;
    }
  }
}
