import {
	Body,
	Controller,
	Get, HttpException, HttpStatus,
	Post,
	Query,
	Req, UseGuards, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { EmptyDTO } from "app.dto";
import { AuthService } from "auth/auth.service";
import { isDefined } from "class-validator";
import { CreateUserDTO, GetUsersDTO, LoginDTO, SubscribeHandlerDTO } from "users/users.dto";
import { UsersService } from 'users/users.service';

@Controller('users')
export class UsersController {
	constructor(private usersService: UsersService, private authService: AuthService) {}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@Post('create')
	async createUser(@Body() { login, pass }: CreateUserDTO) {
		const bad = ' \\/|;<>&?:{}[]()';
		for (let i = 0; i < login.length; i++) {
			if (bad.indexOf(login[i]) !== -1) {
				return { ok: false, msg: `Bad character ('${login[i]}') in login` };
			}
		}
		const r = await this.usersService.createLocal(login, pass, null)
			.catch(e => {
				throw new HttpException(e.detail, HttpStatus.BAD_REQUEST);
			});
		return { ok: true, msg: `User ${r.login} created` };
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@Get()
	async getUsers(@Query() { login, expand }: GetUsersDTO) {

		if (login) {
			const user = await this.usersService.findOneByLogin(login, isDefined(expand));
			if (!user)
				return null;
			return user;
		}
		return await this.usersService.findAll(isDefined(expand));
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get('online')
	getOnline(@Query() {  }: EmptyDTO) {
		// excluding socket property
		return this.usersService.onlineUsers.map(usr => ({
			id: usr.id,
			login: usr.login,
			url_avatar: usr.url_avatar,
			status: usr.status,
			subscriptions: usr.subscriptions,
			subscribers: usr.subscribers
		}));
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get('subscribe')
	async subscribeHandler(@Req() req, @Query() { target }: SubscribeHandlerDTO) {
		const user = req.user;

		return await this.usersService.subscribeToUser(user.id, target);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get('unsubscribe')
	async unsubscribeHandler(@Req() req, @Query() { target }: SubscribeHandlerDTO) {
		const user = req.user;

		return await this.usersService.unsubscribeFromUser(user.id, target);
	}

	// @UseGuards(AuthGuard('jwt'))
	// @Get('avatar')
	// async updateAvatar(@Query('login') login): Promise<string> {
	// 	return await this.usersService.updateAvatar(login);
	// }

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('logout')
	userLogout(@Req() req, @Body() {  }: EmptyDTO) {
		const user = req.user;

		const index = this.usersService.onlineUsers.map(usr => usr.id).indexOf(user.id);
		if (index !== -1) {
			this.usersService.userEvent('logout', this.usersService.onlineUsers[index]);
			this.usersService.onlineUsers.splice(index, 1);
			this.usersService.onlineUsers = this.usersService.onlineUsers.filter(val => {
				if (val) {
					return val;
				}});
		}
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('local'))
	@Post('login')
	async login(@Req() req, @Body() { socketId }: LoginDTO) {
		const user = req.user;

		await this.usersService.login(user.id, socketId);
		return this.authService.login(user);
	}
}
