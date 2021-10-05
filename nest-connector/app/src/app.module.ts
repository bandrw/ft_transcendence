import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CssController } from './css/css.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User_table } from 'src/users/user.entity';
import { UsersModule } from './users/users.module';
import { JsController } from './js/js.controller';
import { LadderModule } from './ladder/ladder.module';
import { GameModule } from './game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {WebSocketGateway} from "@nestjs/websockets";
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'sql',
      port: 5432,
      username: 'pfile',
      password: 'pfile',
      database: 'pfile',
      synchronize: true,
      entities: [User_table],
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
export class AppModule {
}
