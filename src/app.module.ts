import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as fs from 'fs';
import { Iconfig } from './interfaces';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaModule } from './media/media.module';
import { TrendingModule } from './trending/trending.module';
import { RandomModule } from './random/random.module';
import { DetailedMediaModule } from './detailed-media/detailed-media.module';
import { SetupModule } from './setup/setup.module';
import { SetupController } from './setup/setup.controller';
import { SetupService } from './setup/setup.service';
import { MediaController } from './media/media.controller';
import { TrendingController } from './trending/trending.controller';
import { DetailedMediaController } from './detailed-media/detailed-media.controller';
import { RandomController } from './random/random.controller';
import { IBackendMedia } from './IBackendMedia.schema';
import { TrendingService } from './trending/trending.service';
import { MediaService } from './media/media.service';
import { DetailedMediaService } from './detailed-media/detailed-media.service';
import { RandomService } from './random/random.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesController } from './schedules/schedules.controller';
import { SchedulesModule } from './schedules/schedules.module';

import { TypeOrmModule } from '@nestjs/typeorm';

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
          MONGO_URI: '',
          RABBITMQ_URI: '',
          RABBITMQ_QUEUE: '',
          TMDB_API_KEY: '',
          animeLocalPath: '',
          seriesLocalPath: '',
        },
        null,
        2,
      ),
    );
  }
}

function getConfig(): Iconfig {
  checkConfig();

  const config: Iconfig = JSON.parse(
    fs.readFileSync('configuration/appConfig.json', 'utf-8'),
  ) as Iconfig;

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

    MongooseModule.forFeature([
      {
        name: 'Trending',
        schema: IBackendMedia,
        collection: 'trending',
      },
      { name: 'Media', schema: IBackendMedia, collection: 'media' },
      {
        name: 'Random',
        schema: IBackendMedia,
        collection: 'random',
      },
    ]),
    MongooseModule.forRoot(getConfig().MONGO_URI),
    ConfigModule,
    SchedulesModule,
  ],
  controllers: [
    AppController,
    SetupController,
    MediaController,
    TrendingController,
    DetailedMediaController,
    RandomController,
    SchedulesController,
  ],
  providers: [
    AppService,
    SetupService,
    MediaService,
    TrendingService,
    DetailedMediaService,
    RandomService,
  ],
})
export class AppModule {}
