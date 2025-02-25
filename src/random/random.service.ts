import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBackendMedia } from 'src/IBackendMedia.schema';

@Injectable()
export class RandomService {
  constructor(@InjectModel('Media') private mediaModel: Model<IBackendMedia>) {}

  async getRandomAnimes(limit: number): Promise<IBackendMedia[]> {
    const randomAnimes: IBackendMedia[] = await this.mediaModel.aggregate([
      { $match: { type: 'anime' } },
      { $sample: { size: Number(limit) } },
    ]);

    return randomAnimes;
  }

  async getRandomSeries(limit: number): Promise<IBackendMedia[]> {
    const randomSeries: IBackendMedia[] = await this.mediaModel.aggregate([
      { $match: { type: 'serie' } },
      { $sample: { size: Number(limit) } },
    ]);

    return randomSeries;
  }

  async getRandomLocalContent(
    type: string,
    limit: number,
  ): Promise<IBackendMedia[]> {
    const randomLocalContent: IBackendMedia[] = await this.mediaModel.aggregate(
      [
        { $match: { type: type, localSeasons: { $ne: [] } } },
        { $sample: { size: Number(limit) } },
      ],
    );

    return randomLocalContent;
  }
}
