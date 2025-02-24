import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { SchedulesController } from './schedules.controller';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SchedulesService],
  controllers: [SchedulesController],
  exports: [SchedulesService],
  
})
export class SchedulesModule {}
