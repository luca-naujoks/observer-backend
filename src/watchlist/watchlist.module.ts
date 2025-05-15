import { Module } from '@nestjs/common';
import { WatchlistService } from './watchlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { modules } from 'src/shared/typeOrmImports';

@Module({
  imports: [TypeOrmModule.forFeature(modules)],
  controllers: [],
  providers: [WatchlistService, SqliteService],
})
export class WatchlistModule {}
