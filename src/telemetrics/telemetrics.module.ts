import { Module } from '@nestjs/common';
import { TelemetricsService } from './telemetrics.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TelemetricsService],
})
export class TelemetricsModule {}
