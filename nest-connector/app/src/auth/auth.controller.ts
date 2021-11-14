import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Post,
	Query,
	Req,
	UnauthorizedException,
	UseGuards
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "auth/auth.service";
import axios from "axios";
import { UsersService } from "users/users.service";

@Controller('auth')
export class AuthController {

	constructor(private usersService: UsersService, private authService: AuthService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async auth(@Req() req, @Query('socketId') socketId: string) {
		if (!socketId)
			throw new HttpException('Invalid body (socketId)', HttpStatus.BAD_REQUEST);

		await this.usersService.login(req.user.id, socketId);
		return req.user;
	}

	@Post('/intra')
	async authIntra(
		@Body('socketId') socketId: string,
		@Body('code') code: string
	) {
		const data = {
			grant_type: 'authorization_code',
			client_id: process.env.INTRA_UID,
			client_secret: process.env.INTRA_SECRET,
			code: code,
			redirect_uri: process.env.INTRA_REDIRECT
		};
		const r = await axios.post('https://api.intra.42.fr/oauth/token', data)
			.then(res => res.data)
			.catch(() => null);
		if (!r)
			throw new UnauthorizedException();

		const me = await axios.get('https://api.intra.42.fr/v2/me', {
			headers: { Authorization: `Bearer ${r.access_token}` }
		})
			.then(res => res.data)
			.catch(() => null);
		if (!me)
			throw new UnauthorizedException();

		const intraLogin = me.login;
		const intraImage = me.image_url;

		const foundUser = await this.usersService.findOneByIntraLogin(intraLogin);
		if (foundUser)
			return this.authService.login(foundUser);

		const newUser = await this.usersService.createIntra(intraLogin, intraImage);
		return this.authService.login(newUser);
	}

}
