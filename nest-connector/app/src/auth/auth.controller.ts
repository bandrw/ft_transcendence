import { Controller, Get, HttpException, HttpStatus, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "users/users.service";

@Controller('auth')
export class AuthController {

	constructor(private usersService: UsersService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async auth(@Req() req, @Query('socketId') socketId: string) {
		if (!socketId)
			throw new HttpException('Invalid body (socketId)', HttpStatus.BAD_REQUEST);

		await this.usersService.login(req.user.id, socketId);
		return req.user;
	}

}
