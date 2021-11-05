import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
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
      host: 'localhost', // todo [change host to 'db']
      port: 5432,
      username: 'pfile',
      password: 'pfile',
      database: 'pfile',
      entities: [User, GameEntity, UserSubscription],
    }),
    UsersModule,
    LadderModule,
    GameModule,
    ChatModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, CssController, JsController],
  providers: [AppService],
})
export class AppModule {}
