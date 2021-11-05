import {
	Body,
	Controller,
	Get, HttpException, HttpStatus, Inject,
	Post,
	Query,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersGateway } from "users/users.gateway";
import { OnlineUser } from 'users/users.interface';
import { UsersService } from 'users/users.service';

@Controller('users')
export class UsersController {
	@Inject() usersGateway: UsersGateway;

	constructor(private usersService: UsersService) {}

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
		if (login) {
			const user = await this.usersService.findOneByLogin(login, expand === 'true');
			if (!user)
				throw new HttpException('User not found', HttpStatus.NOT_FOUND);
			return user;
		}
		return await this.usersService.findAll(expand === 'true');
	}

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

	@Get('subscribe')
	async subscribeHandler(
		@Query('login') login: string,
		@Query('target') target: string
	) {
		if (!login || !target || login === target)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
		return await this.usersService.subscribeToUser(login, target);
	}

	@Get('unsubscribe')
	async unsubscribeHandler(
		@Query('login') login: string,
		@Query('target') target: string
	) {
		if (!login || !target || login === target)
			throw new HttpException('Invalid body', HttpStatus.BAD_REQUEST);
		return await this.usersService.unsubscribeFromUser(login, target);
	}

	// @Get('del')
	// async delUser(@Query('id') id) {
	// 	await this.UsersService.remove(id);
	// }

	@Get('avatar')
	async updateAvatar(@Query('login') login): Promise<string> {
		return await this.usersService.updateAvatar(login);
	}

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

	// @Get('checkExist')
	// async checkExist(@Query('login') login) {
	// 	const r = await this.UsersService.usersRepository.findOne({
	// 		where: { login: login },
	// 	});
	// 	if (r) return { ok: true, msg: r };
	// 	return { ok: false, msg: "User doesn't exist" };
	// }

	async emitter(login: string, socketId: string) {
		if (!login)
			throw new HttpException('Invalid login', HttpStatus.BAD_REQUEST);

		const user = await this.usersService.findOneByLogin(login, true);
		if (!user)
			throw new HttpException('User not found', HttpStatus.BAD_REQUEST);

		UsersGateway.users.set(socketId, login);

		const newUser: OnlineUser = {
			id: user.id,
			login: login,
			socket: UsersGateway.sockets.get(socketId),
			url_avatar: user.url_avatar,
			status: 'green',
			subscribers: [],
			subscriptions: []
		};

		for (let i = 0; i < user.subscriptions.length; ++i)
			newUser.subscriptions.push(await this.usersService.findOneById(user.subscriptions[i].targetId));

		for (let i = 0; i < user.subscribers.length; ++i)
			newUser.subscribers.push(await this.usersService.findOneById(user.subscribers[i].userId));

		const index = this.usersService.onlineUsers.map(usr => usr.login).indexOf(login);
		if (index === -1)
			this.usersService.onlineUsers.push(newUser);
		else
			this.usersService.onlineUsers[index] = newUser;
		this.usersService.userEvent('updateUser', newUser);
		return ;
	}

	@Post('login')
	async authentication(@Body() body: { login: string, socketId: string }) {

		if (!body.login)
			throw new HttpException('Invalid body (login)', HttpStatus.BAD_REQUEST);
		if (!body.socketId)
			throw new HttpException('Invalid body (socketId)', HttpStatus.BAD_REQUEST);

		const r = await this.usersService.findOneByLogin(body.login);
		if (r) {
			await this.emitter(body.login, body.socketId);
			return { ok: true, msg: r };
		} else {
			return { ok: false, msg: 'User not found' };
		}
	}
}
