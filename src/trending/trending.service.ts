import { Injectable } from '@nestjs/common';
import { Media } from 'src/enities/media.entity';
import { Trending } from 'src/enities/trending.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class TrendingService {
  constructor(private readonly sqliteService: SqliteService) {}

  async getTrendingAnime(limit: number): Promise<Media[]> {
    const trendingItems: Trending[] =
      await this.sqliteService.findTrending('anime');

    const mediaList = Promise.all(
      trendingItems.map(async (trendingItem) => {
        const media: Media = await this.sqliteService.findOneById(
          trendingItem.media_id,
        );
        return media;
      }),
    );

    return (await mediaList).sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  async getTrendingSerie(limit: number): Promise<Media[]> {
    const trendingItems: Trending[] =
      await this.sqliteService.findTrending('series');

    const mediaList = Promise.all(
      trendingItems.map(async (trendingItem) => {
        const media: Media = await this.sqliteService.findOneById(
          trendingItem.media_id,
        );
        return media;
      }),
    );

    return (await mediaList).sort(() => 0.5 - Math.random()).slice(0, limit);
  }
}
