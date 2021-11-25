import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CssController } from './css/css.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from './users/users.module';
import { JsController } from './js/js.controller';
import { LadderModule } from './ladder/ladder.module';
import { GameModule } from './game/game.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatModule } from './chat/chat.module';
import { Events } from './events';
import { GameHistory } from './game/game.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

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
      entities: [User, GameHistory],
    }),
    UsersModule,
    LadderModule,
    GameModule,
    ChatModule,
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule.register(process.env.NEST_JWT_SECRET_KEY),
  ],
  controllers: [AppController, CssController, JsController],
  providers: [AppService, Events],
})
export class AppModule {}
