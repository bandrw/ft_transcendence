import {
  Controller,
  Get,
  Res,
  Query,
  Post,
  Param,
  Req,
  Header,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request, json } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnlineUser } from './users.interface';

@Controller('users')
export class UsersController {
  private onlineUsers: OnlineUser[] = [];
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
  @Get('getOnline')
  getOnline(@Res() response: Response) {
    response.send(
      this.onlineUsers.map(function (e) {
        return { login: e.login, url_avatar: e.url_avatar };
      }),
    );
  }
  @Get('del')
  delUser(@Query('id') id) {
    this.UsersService.remove(id);
  }
  @Get('avatar')
  async updateAvatar(@Query('login') login): Promise<string> {
    return await this.UsersService.updateAvatar(login);
  }
  @Post('logout')
  userLogout(@Req() req: Request) {
    const index = this.onlineUsers
      .map(function (e) {
        return e.login;
      })
      .indexOf(req.body.user.login);
    if (index != -1) {
      this.UsersService.userEvent(
        this.onlineUsers,
        'logout_SSE',
        this.onlineUsers[index].login,
      );
      this.onlineUsers.splice(index, 1);
    }
  }
  @Get('login')
  @Header('Content-Type', 'text/event-stream')
  @Header('Transfer-Encoding', 'chunked')
  @HttpCode(200)
  async emitter(
    @Req() req: Request,
    @Query('login') login,
    @Res() response: Response,
  ) {
    const user = await this.UsersService.usersRepository.findOne({
      where: { login: login },
    });
    req.socket.setTimeout(1000 * 60 * 60);
    this.onlineUsers.push({
      login: login,
      resp: response,
      url_avatar: user.url_avatar,
    });
    this.UsersService.userEvent(this.onlineUsers, 'login', login);
  }
  @Post('login')
  async authentification(@Req() req: Request, @Res() response: Response) {
    response.send(await this.UsersService.login(response, req.body.login));
  }
}
