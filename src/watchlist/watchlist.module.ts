import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchlistItem } from 'src/enities/watchlist.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { Media } from 'src/enities/media.entity';
import { Trending } from 'src/enities/trending.entity';
import { Tag } from 'src/enities/tags.entity';
import { Log } from 'src/enities/log.entity';
import { LocalSeason } from 'src/enities/localSeasons.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Media,
      LocalSeason,
      Trending,
      Tag,
      Log,
      WatchlistItem,
    ]),
  ],
  controllers: [],
  providers: [WatchlistService, SqliteService],
})
export class WatchlistModule {}
