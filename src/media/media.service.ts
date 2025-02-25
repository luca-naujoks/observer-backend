import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBackendMedia } from 'src/IBackendMedia.schema';

@Injectable()
export class MediaService {
  constructor(@InjectModel('Media') private mediaModel: Model<IBackendMedia>) {}

  async getAnimes(page: number, search: string): Promise<IBackendMedia[]> {
    const media: IBackendMedia[] = await this.mediaModel
      .find({ type: 'anime' })
      .skip(page * 100)
      .limit(100)
      .find(
        search
          ? {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { streamName: { $regex: search, $options: 'i' } },
              ],
            }
          : {},
      )
      .exec();
    return media;
  }

  async getSeries(page: number, search: string): Promise<IBackendMedia[]> {
    const media: IBackendMedia[] = await this.mediaModel
      .find({ type: 'serie' })
      .skip(page * 100)
      .limit(100)
      .find(
        search
          ? {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { streamName: { $regex: search, $options: 'i' } },
              ],
            }
          : {},
      )
      .exec();
    return media;
  }

  async getLocal(
    type: string,
    page: number,
    search: string,
  ): Promise<IBackendMedia[]> {
    const media: IBackendMedia[] = await this.mediaModel
      .find({ type: type, localSeasons: { $ne: [] } })
      .skip(page * 100)
      .limit(100)
      .find(
        search
          ? {
              $or: [
                { name: { $regex: search, $options: 'i' } },
                { streamName: { $regex: search, $options: 'i' } },
              ],
            }
          : {},
      )
      .exec();
    return media;
  }

  async updateMediaTMDB(
    streamName: IBackendMedia['streamName'],
    tmdbID: IBackendMedia['tmdbID'],
  ) {
    await this.mediaModel.updateOne({ streamName }, { tmdbID });
  }
}
