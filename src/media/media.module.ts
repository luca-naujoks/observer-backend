import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { IBackendMedia } from 'src/IBackendMedia.schema';
import { MongooseModule } from '@nestjs/mongoose';

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
  providers: [MediaService],
})
export class MediaModule {}
