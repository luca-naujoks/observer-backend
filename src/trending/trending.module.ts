import { Module } from '@nestjs/common';
import { TrendingService } from './trending.service';
import { IBackendMedia } from 'src/IBackendMedia.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TrendingController } from './trending.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Trending',
        schema: IBackendMedia,
        collection: 'trending',
      },
    ]),
  ],
  controllers: [TrendingController],
  providers: [TrendingService],
})
export class TrendingModule {}
