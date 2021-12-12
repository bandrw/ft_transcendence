import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { JwtStrategy } from "auth/jwt.strategy";
import { LocalStrategy } from "auth/local.strategy";
import { TwilioModule } from "nestjs-twilio";
import { UsersModule } from "users/users.module";

@Module({
	imports: [PassportModule, forwardRef(() => UsersModule), JwtModule.register({
		secret: process.env.JWT_SECRET,
		signOptions: { expiresIn: '3600s' },
	}), TwilioModule.forRoot({
		accountSid: 'ACc92f2aca9ccc90f2cadfc47c17a2094e',
		authToken: '2f123d41b0b0b1e7a98d2f18ddb550b8',
	}),],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {}
