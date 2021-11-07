import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { ChatEntity } from "chat/chat.entity";
import { ChatModule } from 'chat/chat.module';
import { CssController } from 'css/css.controller';
import { GameEntity } from "game/game.entity";
import { GameModule } from 'game/game.module';
import { JsController } from 'js/js.controller';
import { LadderModule } from 'ladder/ladder.module';
import { UserSubscription } from "users/entities/subscription.entity";
import { User } from 'users/entities/user.entity';
import { UsersModule } from 'users/users.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: 5432,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			database: process.env.POSTGRES_DB,
			entities: [User, GameEntity, UserSubscription, ChatEntity],
			retryAttempts: 50,
			retryDelay: 5000
		}),
		UsersModule,
		LadderModule,
		GameModule,
		EventEmitterModule.forRoot(),
		ChatModule,
	],
	controllers: [AppController, CssController, JsController],
	providers: [AppService],
})
export class AppModule {}
