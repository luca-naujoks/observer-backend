import { Test, TestingModule } from '@nestjs/testing';
import { TelemetricsController } from './telemetrics.controller';

describe('TelemetricsController', () => {
  let controller: TelemetricsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetricsController],
    }).compile();

    controller = module.get<TelemetricsController>(TelemetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
