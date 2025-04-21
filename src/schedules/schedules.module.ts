import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/enities/media.entity';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { Log } from 'src/enities/log.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Media, LocalSeason, Tag, Trending, Log]),
  ],
  providers: [SchedulesService, SqliteService],
  controllers: [SchedulesController],
  exports: [SchedulesService],
})
export class SchedulesModule {}
