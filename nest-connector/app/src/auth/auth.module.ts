import { DynamicModule, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({})
export class AuthModule {
  static register(secret?): DynamicModule {
    let authMod;
    if (secret) {
      authMod = JwtModule.register({
        secret: secret,
        signOptions: { expiresIn: '60s' },
      });
    } else {
      authMod = 'test';
    }
    return {
      module: AuthModule,
      providers: [AuthService, LocalStrategy, JwtStrategy],
      imports: [UsersModule, PassportModule, authMod],
      exports: [AuthService],
      controllers: [AuthController],
    };
  }
}
