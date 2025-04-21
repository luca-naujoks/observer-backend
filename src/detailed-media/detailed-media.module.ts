import { Module } from '@nestjs/common';
import { DetailedMediaService } from './detailed-media.service';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Media } from 'src/enities/media.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/enities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, LocalSeason, Tag, Trending, Log])],
  providers: [DetailedMediaService, SqliteService],
})
export class DetailedMediaModule {}
