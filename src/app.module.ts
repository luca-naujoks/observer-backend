import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as fs from 'fs';
import { IBackendConfig } from './shared/OutputInterfaces';
import { DetailedMediaModule } from './detailed-media/detailed-media.module';
import { SetupModule } from './setup/setup.module';
import { SetupController } from './setup/setup.controller';
import { SetupService } from './setup/setup.service';
import { MediaController } from './media/media.controller';
import { DetailedMediaController } from './detailed-media/detailed-media.controller';

import { MediaService } from './media/media.service';
import { DetailedMediaService } from './detailed-media/detailed-media.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteModule } from './sqlite/sqlite.module';
import { SqliteService } from './sqlite/sqlite.service';
import { SqliteController } from './sqlite/sqlite.controller';
import { Media } from './enities/media.entity';
import { Tag } from './enities/tags.entity';
import { Trending } from './enities/trending.entity';
import { LocalSeason } from './enities/localSeasons.entity';
import { MediaModule } from './media/media.module';
import { Log } from './enities/log.entity';
import { WatchlistController } from './watchlist/watchlist.controller';
import { WatchlistModule } from './watchlist/watchlist.module';
import { WatchlistItem } from './enities/watchlist.entity';
import { WatchlistService } from './watchlist/watchlist.service';
import { TelemetricsController } from './telemetrics/telemetrics.controller';
import { TelemetricsModule } from './telemetrics/telemetrics.module';
import { ProviderController } from './provider/provider.controller';
import { ProviderModule } from './provider/provider.module';

function checkConfig() {
  if (!fs.existsSync('storage')) {
    fs.mkdirSync('storage');
  }
  if (!fs.existsSync('storage/appConfig.json')) {
    fs.writeFileSync(
      'storage/appConfig.json',
      JSON.stringify(
        {
          CONFIGURED: false,
          TMDB_API_KEY: '',
          LOCAL_ANIME_PATH: '',
          LOCAL_SERIES_PATH: '',
          PAGE_SIZE: 100,
        },
        null,
        2,
      ),
    );
  }
}

function getConfig(): IBackendConfig {
  checkConfig();

  const config: IBackendConfig = JSON.parse(
    fs.readFileSync('storage/appConfig.json', 'utf-8'),
  ) as IBackendConfig;

  return config;
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'storage/db.sqlite3',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Media,
      Tag,
      Trending,
      LocalSeason,
      Log,
      WatchlistItem,
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfig],
    }),
    ScheduleModule.forRoot(),
    SetupModule,
    MediaModule,
    DetailedMediaModule,
    ConfigModule,
    SqliteModule,
    WatchlistModule,
    TelemetricsModule,
    ProviderModule,
  ],
  controllers: [
    AppController,
    SetupController,
    MediaController,
    DetailedMediaController,
    SqliteController,
    WatchlistController,
    TelemetricsController,
    ProviderController,
  ],
  providers: [
    AppService,
    SetupService,
    MediaService,
    DetailedMediaService,
    SqliteService,
    WatchlistService,
  ],
})
export class AppModule {}
