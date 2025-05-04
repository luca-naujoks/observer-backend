import { Test, TestingModule } from '@nestjs/testing';
import { TelemetricsService } from './telemetrics.service';

describe('TelemetricsService', () => {
  let service: TelemetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelemetricsService],
    }).compile();

    service = module.get<TelemetricsService>(TelemetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
