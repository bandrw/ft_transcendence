import {
	Body,
	Controller,
	Get, HttpException, HttpStatus,
	Post,
	Query,
	Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "auth/auth.service";
import { Request } from 'express';
import { UsersService } from 'users/users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@Post('create')
	async createUser(
		@Body('login') login: string,
		@Body('pass') pass: string,
	) {
		if (!login || !pass)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);

		const bad = ' \\/|;<>&?:{}[]()';
		for (let i = 0; i < login.length; i++) {
			if (bad.indexOf(login[i]) !== -1) {
				return { ok: false, msg: `Bad character ('${login[i]}') in login` };
			}
		}
		const r = await this.usersService.create(login, pass)
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
		// if (!await this.authorize(headers.authorization))
		// 	throw new HttpException('Access Denied', HttpStatus.UNAUTHORIZED);

		if (login) {
			const user = await this.usersService.findOneByLogin(login, expand === 'true');
			if (!user)
				return null;
			return user;
		}
		return await this.usersService.findAll(expand === 'true');
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('online')
	getOnline() {
		return this.usersService.onlineUsers.map(usr => ({
			id: usr.id,
			login: usr.login,
			url_avatar: usr.url_avatar,
			status: usr.status,
			subscriptions: usr.subscriptions,
			subscribers: usr.subscribers
		}));
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('subscribe')
	async subscribeHandler(
		@Query('login') login: string,
		@Query('target') target: string
	) {
		if (!login || !target || login === target)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
		return await this.usersService.subscribeToUser(login, target);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('unsubscribe')
	async unsubscribeHandler(
		@Query('login') login: string,
		@Query('target') target: string
	) {
		if (!login || !target || login === target)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
		return await this.usersService.unsubscribeFromUser(login, target);
	}

	// @UseGuards(AuthGuard('jwt'))
	// @Get('avatar')
	// async updateAvatar(@Query('login') login): Promise<string> {
	// 	return await this.usersService.updateAvatar(login);
	// }

	@UseGuards(AuthGuard('jwt'))
	@Post('logout')
	userLogout(@Req() req: Request) {
		const index = this.usersService.onlineUsers.map(usr => usr.login).indexOf(req.body.user.login);
		if (index != -1) {
			this.usersService.userEvent('logout', this.usersService.onlineUsers[index]);
			this.usersService.onlineUsers.splice(index, 1);
			this.usersService.onlineUsers = this.usersService.onlineUsers.filter(val => {
				if (val) {
					return val;
				}});
		}
	}

	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Req() req, @Body() body: { socketId: string, code: string}) {
		if (!body.socketId)
			throw new HttpException('Invalid body (socketId)', HttpStatus.BAD_REQUEST);

		await this.usersService.login(req.user.id, body.socketId);
		return this.authService.login(req.user);
		// return { ok: true, msg: user };
	}
}
