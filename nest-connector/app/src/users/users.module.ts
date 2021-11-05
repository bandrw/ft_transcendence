import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSubscription } from "users/entities/subscription.entity";
import { User } from 'users/entities/user.entity';
import { UsersController } from 'users/users.controller';
import { UsersGateway } from 'users/users.gateway';
import { UsersService } from 'users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSubscription])],
  providers: [UsersService, UsersGateway],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
