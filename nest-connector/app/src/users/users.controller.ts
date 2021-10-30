import {
	Body,
	Controller,
	Get,
	Header,
	HttpCode, HttpException, HttpStatus, Param,
	Post,
	Query,
	Req,
	Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { OnlineUser } from 'users/users.interface';
import { UsersService } from 'users/users.service';

@Controller('users')
export class UsersController {
	constructor(private UsersService: UsersService) {}

	@Post('create')
	async createUser(
		@Body('login') login: string,
		@Body('pass') pass: string,
	) {
		if (!login || !pass)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);

		const bad = ' /|;<>&?:{}[]()';
		for (let i = 0; i < login.length; i++) {
			if (bad.indexOf(login[i]) !== -1) {
				return { ok: false, msg: `Bad character ('${login[i]}') in login` };
			}
		}
		const r = await this.UsersService.create(login, pass)
			.catch((e) => {
				throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
			});
		return { ok: true, msg: `User ${r.login} created` };
	}

	@Get()
	async getUsers(
		@Query('login') login: string,
		@Query('expand') expand: string
	) {
		if (login) {
			const user = await this.UsersService.findOneByLogin(login, expand === 'true');
			if (!user)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			return user;
		}
		return await this.UsersService.findAll(expand === 'true');
	}

	@Get('online')
	getOnline() {
		return this.UsersService.onlineUsers.map(usr => {
				return {
					login: usr.login,
					url_avatar: usr.url_avatar,
					status: usr.status
				};
			});
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
			this.UsersService.onlineUsers = this.UsersService.onlineUsers.filter(val => {
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
		if (r) return { ok: true, msg: r };
		return { ok: false, msg: "User doesn't exist" };
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
		if (!login)
			throw new HttpException('Invalid login', HttpStatus.BAD_REQUEST);

		const user = await this.UsersService.findOneByLogin(login);
		if (!user)
			throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

		req.socket.setTimeout(1000 * 60 * 60 * 60);
		const newUser: OnlineUser = {
			id: user.id,
			login: login,
			resp: response,
			url_avatar: user.url_avatar,
			status: 'green'
		};
		const index = this.UsersService.onlineUsers.map(usr => usr.login).indexOf(login);
		if (index === -1) this.UsersService.onlineUsers.push(newUser);
		else this.UsersService.onlineUsers[index] = newUser;
		this.UsersService.userEvent('updateUser', newUser);
		return ;
	}

	@Post('login')
	async authentication(@Req() req: Request, @Res() response: Response) {
		if (!req.body.login)
			throw new HttpException('Invalid body (login)', HttpStatus.BAD_REQUEST);

		const r = await this.UsersService.findOneByLogin(req.body.login);
		if (r) {
			await this.emitter(req, req.body.login, response);
			response.send({ ok: true, msg: r });
			return ;
		} else {
			response.send({ ok: false, msg: 'User not found' });
			return ;
		}
	}
}
