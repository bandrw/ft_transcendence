import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from 'auth/auth.controller';
import { AuthService } from 'auth/auth.service';
import { JwtStrategy } from "auth/jwt.strategy";
import { LocalStrategy } from "auth/local.strategy";
import { UsersModule } from "users/users.module";

@Module({
	imports: [PassportModule, forwardRef(() => UsersModule), JwtModule.register({
		secret: 'some_secret',
		signOptions: { expiresIn: '3600s' }
	})],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [AuthService],
	controllers: [AuthController]
})
export class AuthModule {}
