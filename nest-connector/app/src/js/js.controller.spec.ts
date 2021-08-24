import { Test, TestingModule } from '@nestjs/testing';
import { JsController } from './js.controller';

describe('JsController', () => {
  let controller: JsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JsController],
    }).compile();

    controller = module.get<JsController>(JsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
