import { Test, TestingModule } from '@nestjs/testing';
import { SqliteController } from './sqlite.controller';

describe('SqliteController', () => {
  let controller: SqliteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SqliteController],
    }).compile();

    controller = module.get<SqliteController>(SqliteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
