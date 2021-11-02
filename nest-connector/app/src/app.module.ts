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
import { User } from 'users/user.entity';
import { UsersModule } from 'users/users.module';

import { Events } from './events';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db', // todo [change host to 'db']
      port: 5432,
      username: 'pfile',
      password: 'pfile',
      database: 'pfile',
      entities: [User, GameEntity],
    }),
    UsersModule,
    LadderModule,
    GameModule,
    ChatModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, CssController, JsController],
  providers: [AppService, Events],
})
export class AppModule {}
