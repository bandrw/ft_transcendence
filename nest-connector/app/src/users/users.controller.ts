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
          // res.send(bad[k]);
          res.send({ ok: false, msg: `Bad character ('${bad[k]}') in login` })
          return;
        }
      }
    }
    // res.send(true);
    res.send({ ok: true, msg: 'User created' })
    await this.UsersService.create(req.body.login, req.body.pass);
  }
  @Get('getAll')
  getUsers(@Res() res: Response) {
    this.UsersService.findAll(res);
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
  delUser(@Query('id') id) {
    this.UsersService.remove(id);
  }
  @Get('avatar')
  async updateAvatar(@Query('login') login): Promise<string> {
    return await this.UsersService.updateAvatar(login);
  }
  @Post('logout')
  userLogout(@Req() req: Request) {
    const index = this.UsersService.onlineUsers
      .map(function (e) {
        return e.login;
      })
      .indexOf(req.body.user.login);
    if (index != -1) {
      this.UsersService.userEvent(
        'logout_SSE',
        this.UsersService.onlineUsers[index],
      );
      this.UsersService.onlineUsers[index].resp.end();
      this.UsersService.onlineUsers.splice(index, 1);
      this.UsersService.onlineUsers = this.UsersService.onlineUsers.filter(
        function (val) {
          if (val) {
            return val;
          }
        },
      );
    }
  }

  @Get('checkExist')
  async checkExist(@Query('login') login) {
    const r = await this.UsersService.usersRepository.findOne({
      where: { login: login },
    });
    if (r)
      return { ok: true, msg: r }
    return { ok: false, msg: 'User doesn\'t exists' }
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
    if (user === undefined)
      return
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
  @Post('login')
  async authentification(@Req() req: Request, @Res() response: Response) {
    const r = await this.UsersService.login(response, req.body.login);
    if (r) {
      await this.emitter(req, req.body.login, response)
      response.send({ ok: true, msg: r });
    } else {
      response.send({ ok: false, msh: 'User not found' })
    }
  }
}
