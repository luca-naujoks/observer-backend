import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as fs from 'fs';
import { IBackendConfig } from './OutputInterfaces';
import { DetailedMediaModule } from './detailed-media/detailed-media.module';
import { SetupModule } from './setup/setup.module';
import { SetupController } from './setup/setup.controller';
import { SetupService } from './setup/setup.service';
import { MediaController } from './media/media.controller';
import { TrendingController } from './trending/trending.controller';
import { DetailedMediaController } from './detailed-media/detailed-media.controller';
import { RandomController } from './random/random.controller';

import { TrendingService } from './trending/trending.service';
import { MediaService } from './media/media.service';
import { DetailedMediaService } from './detailed-media/detailed-media.service';
import { RandomService } from './random/random.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesModule } from './schedules/schedules.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteModule } from './sqlite/sqlite.module';
import { SqliteService } from './sqlite/sqlite.service';
import { SqliteController } from './sqlite/sqlite.controller';
import { Media } from './enities/media.entity';
import { Tag } from './enities/tags.entity';
import { Trending } from './enities/trending.entity';
import { LocalSeason } from './enities/localSeasons.entity';
import { MediaModule } from './media/media.module';
import { RandomModule } from './random/random.module';
import { TrendingModule } from './trending/trending.module';

function checkConfig() {
  if (!fs.existsSync('configuration')) {
    fs.mkdirSync('configuration');
  }
  if (!fs.existsSync('configuration/appConfig.json')) {
    fs.writeFileSync(
      'configuration/appConfig.json',
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
    fs.readFileSync('configuration/appConfig.json', 'utf-8'),
  ) as IBackendConfig;

  return config;
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'configuration/db/database.sqlite3',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Media, Tag, Trending, LocalSeason]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getConfig],
    }),
    ScheduleModule.forRoot(),
    SetupModule,
    MediaModule,
    TrendingModule,
    RandomModule,
    DetailedMediaModule,
    ConfigModule,
    SchedulesModule,
    SqliteModule,
  ],
  controllers: [
    AppController,
    SetupController,
    MediaController,
    TrendingController,
    DetailedMediaController,
    RandomController,
    SchedulesController,
    SqliteController,
  ],
  providers: [
    AppService,
    SetupService,
    MediaService,
    TrendingService,
    DetailedMediaService,
    RandomService,
    SqliteService,
  ],
})
export class AppModule {}
