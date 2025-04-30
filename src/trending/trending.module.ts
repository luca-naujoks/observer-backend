import { Module } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { TrendingController } from './trending.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Media } from 'src/enities/media.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { Log } from 'src/enities/log.entity';
import { WatchlistItem } from 'src/enities/watchlist.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
      LocalSeason,
      Tag,
      Trending,
      Log,
      WatchlistItem,
    ]),
  ],
  controllers: [TrendingController],
  providers: [TrendingService, SqliteService],
})
export class TrendingModule {}
