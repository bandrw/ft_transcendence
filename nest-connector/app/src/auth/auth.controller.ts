import {
	Body,
	Controller,
	Get, HttpException, HttpStatus,
	Post,
	Query,
	Req,
	UnauthorizedException,
	UseGuards, UsePipes, ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { EmptyDTO } from "app.dto";
import { AuthDTO, AuthIntraDTO, SendSmsDTO, VerifySmsDTO } from "auth/auth.dto";
import { AuthService } from "auth/auth.service";
import axios from "axios";
import { UsersService } from "users/users.service";

@Controller('auth')
export class AuthController {

	constructor(private usersService: UsersService, private authService: AuthService) {}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get()
	async auth(@Req() req, @Query() { socketId }: AuthDTO) {
		const user = req.user;

		await this.usersService.login(user.id, socketId);
		return user;
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@Post('/intra')
	async authIntra(@Body() { code }: AuthIntraDTO) {
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

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get('sendSms')
	async sendSms(@Req() req, @Query() { phoneNumber }: SendSmsDTO) {
		const user = req.user;

		if (!await this.usersService.findOneById(user.id))
			throw new HttpException('Access Denied', HttpStatus.UNAUTHORIZED);

		return await this.authService.sendSMS(phoneNumber);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Get('verifySms')
	async verifySms(@Req() req, @Query() { code, phoneNumber }: VerifySmsDTO) {
		const user = req.user;

		return await this.authService.verifySMS(user.id, phoneNumber, code);
	}

	@UsePipes(new ValidationPipe({ transform: true, forbidNonWhitelisted: true }))
	@UseGuards(AuthGuard('jwt'))
	@Post('disable2FA')
	async disable2FA(@Req() req, @Body() {  }: EmptyDTO) {
		const user = req.user;

		return await this.usersService.disable2FA(user.id);
	}

}
