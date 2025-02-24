import { Module } from '@nestjs/common';
import { DetailedMediaService } from './detailed-media.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IBackendMedia } from 'src/IBackendMedia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Media', schema: IBackendMedia, collection: 'media' },
    ]),
  ],
  providers: [DetailedMediaService],
})
export class DetailedMediaModule {}
