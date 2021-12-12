import { Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from 'bcryptjs';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { UsersService } from "users/users.service";

@Injectable()
export class AuthService {

	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		@InjectTwilio() private readonly client: TwilioClient
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

	sendSMS(number: string) {
		this.client.verify.services('VA300459ded82aacce929f83fe2fab391e')
			.verifications
			.create({ to: number, channel: 'sms' })
			.then(verification => console.log(verification))
			.catch(e => {console.log(e);});
	}

	verifySMS(number: string, code) {
		this.client.verify.services('VA300459ded82aacce929f83fe2fab391e')
			.verificationChecks.create({
			to: number,
			code: code
		})
			.then(check => {
				if (check.status === "approved") {
					console.log("success");
				}
			});
	}
}
