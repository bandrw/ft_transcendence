import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import * as bcryptjs from 'bcryptjs';
import { Twilio } from "twilio";
import { UsersService } from "users/users.service";

@Injectable()
export class AuthService {
	private twilioClient: Twilio;

	constructor(
		private usersService: UsersService,
		private jwtService: JwtService,
		// @InjectTwilio() private readonly twilioClient: TwilioClient
	) {
		this.twilioClient = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
	}

	async validateUser(username: string, pass: string): Promise<any> {
		const user = await this.usersService.findOneByLogin(username);
		if (user && bcryptjs.compareSync(pass, user.password)) {
			const { password, ...result } = user;
			return result;
		}
		return null;
	}

	login(user: any) {
		const payload = { id: user.id, username: user.login };

		return { access_token: this.jwtService.sign(payload) };
	}

	async sendSMS(phoneNumber: string) {
		const TWILIO_SERVICE_SID = 'VA2ddf93cac730c8ac66eb7ebd4749589d';

		return await this.twilioClient.verify.services(TWILIO_SERVICE_SID)
			.verifications
			.create({ to: phoneNumber, channel: 'sms' });
	}

	async verifySMS(userId: number, phoneNumber: string, code: string) {
		const TWILIO_SERVICE_SID = 'VA2ddf93cac730c8ac66eb7ebd4749589d';

		const user = await this.usersService.findOneById(userId);
		if (!user) return;

		return await this.twilioClient.verify.services(TWILIO_SERVICE_SID)
			.verificationChecks
			.create({
				to: phoneNumber,
				code: code
			})
			.then(check => {
				if (check.status === "approved") {
					return this.usersService.savePhoneNumber(user, phoneNumber);
				}
				throw new HttpException('Wrong code', HttpStatus.BAD_REQUEST);
			});
	}
}
