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
        return {
          login: e.login,
          url_avatar: e.url_avatar,
          status: e.status,
          games: e.games,
          wins: e.wins,
        };
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
  @Post('logout')
  userLogout(@Req() req: Request) {
    let index = 0;
    while (index < this.UsersService.onlineUsers.length) {
      if (this.UsersService.onlineUsers[index].login === req.body.login) {
        this.UsersService.userEvent(
          'logout_SSE',
          this.UsersService.onlineUsers[index],
        );
        this.UsersService.onlineUsers[index].resp.end();
        this.UsersService.onlineUsers[index] = null;
        return;
      }
      ++index;
    }
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
  async emitter(
    @Req() req: Request,
    @Query('login') login,
    @Res() response: Response,
  ) {
    const user = await this.UsersService.usersRepository.findOne({
      where: { login: login },
    });
    req.socket.setTimeout(1000 * 60 * 60 * 60);
    const newUser: OnlineUser = {
      login: login,
      resp: response,
      url_avatar: user.url_avatar,
      status: 'green',
      games: user.games,
      wins: user.wins,
    };
    this.UsersService.onlineUsers.push(newUser);
    this.UsersService.userEvent('login', newUser);
  }
}
