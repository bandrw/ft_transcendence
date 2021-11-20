import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from 'bcryptjs';
import { UsersService } from "users/users.service";

@Injectable()
export class AuthService {

	constructor(
		private usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOneByLogin(username);
		if (user && bcryptjs.compareSync(pass, user.password)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	async login(user: any) {
		const payload = { id: user.id, username: user.login };

		return { access_token: this.jwtService.sign(payload) };
	}

}
