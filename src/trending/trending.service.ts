import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBackendMedia } from 'src/IBackendMedia.schema';

@Injectable()
export class TrendingService {
  constructor(
    @InjectModel('Trending') private trendingModel: Model<IBackendMedia>,
  ) {}

  async getTrendingAnime(limit: number): Promise<IBackendMedia[]> {
    const media: IBackendMedia[] = await this.trendingModel.find().exec();
    const anime = media.filter((m) => m.type === 'anime');
    return anime.sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  async getTrendingSerie(limit: number): Promise<IBackendMedia[]> {
    const media: IBackendMedia[] = await this.trendingModel.find().exec();
    const series = media.filter((m) => m.type === 'serie');
    return series.sort(() => 0.5 - Math.random()).slice(0, limit);
  }
}
