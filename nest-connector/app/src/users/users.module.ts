import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from "auth/auth.module";
import { UserSubscription } from "users/entities/subscription.entity";
import { User } from 'users/entities/user.entity';
import { UsersController } from 'users/users.controller';
import { UsersGateway } from 'users/users.gateway';
import { UsersService } from 'users/users.service';

@Module({
	imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User, UserSubscription])],
	controllers: [UsersController],
	providers: [UsersService, UsersGateway],
	exports: [UsersService],
})
export class UsersModule {}
