import { Test, TestingModule } from '@nestjs/testing';
import { LadderService } from './ladder.service';
import { UsersModule } from '../users/users.module';
import { GameModule } from '../game/game.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { INestApplication } from '@nestjs/common';
import { Repository } from 'typeorm';

describe('LadderService', () => {
  let service: LadderService;
  let app: INestApplication;
  let repository: Repository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        GameModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'sql',
          port: 5432,
          username: 'pfile',
          password: 'pfile',
          database: 'test',
          synchronize: false,
          entities: [User],
        }),
      ],
      providers: [LadderService],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    repository = module.get('UserRepository');
    service = module.get<LadderService>(LadderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
