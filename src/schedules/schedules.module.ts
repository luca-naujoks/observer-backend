import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/enities/media.entity';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Media, LocalSeason, Tag, Trending]),
  ],
  providers: [SchedulesService],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
