import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IBackendMedia } from 'src/IBackendMedia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Media',
        schema: IBackendMedia,
        collection: 'media',
      },
    ]),
  ],
  providers: [RandomService],
})
export class RandomModule {}
