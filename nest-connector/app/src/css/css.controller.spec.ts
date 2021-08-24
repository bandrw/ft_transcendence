import { Test, TestingModule } from '@nestjs/testing';
import { CssController } from './css.controller';

describe('CssController', () => {
  let controller: CssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CssController],
    }).compile();

    controller = module.get<CssController>(CssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
