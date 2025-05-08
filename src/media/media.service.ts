import { Injectable } from '@nestjs/common';
import { Media } from 'src/enities/media.entity';
import { Trending } from 'src/enities/trending.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class MediaService {
  constructor(private readonly sqliteService: SqliteService) {}

  async getAnimes(page: number, search: string): Promise<Media[]> {
    const media: Media[] = await this.sqliteService.getMedia({
      type: 'anime',
      page: page,
      local: false,
      search: search,
    });
    return media;
  }

  async getTrendingAnime(limit: number): Promise<Media[]> {
    const trendingItems: Trending[] = await this.sqliteService.getTrending({
      mediaType: 'anime',
    });

    const mediaList = Promise.all(
      trendingItems.map(async (trendingItem) => {
        const media: Media = await this.sqliteService.getOneById({
          id: trendingItem.media_id,
        });
        return media;
      }),
    );

    return (await mediaList).sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  async getRandomAnimes(limit: number): Promise<Media[]> {
    const randomAnimes: Media[] = await this.sqliteService.getRandomMedia({
      type: 'anime',
      count: limit,
    });

    return randomAnimes;
  }

  async getSeries(page: number, search: string): Promise<Media[]> {
    const media: Media[] = await this.sqliteService.getMedia({
      type: 'series',
      page: page,
      local: false,
      search: search,
    });
    return media;
  }

  async getTrendingSeries(limit: number): Promise<Media[]> {
    const trendingItems: Trending[] = await this.sqliteService.getTrending({
      mediaType: 'series',
    });

    const mediaList = Promise.all(
      trendingItems.map(async (trendingItem) => {
        const media: Media = await this.sqliteService.getOneById({
          id: trendingItem.media_id,
        });
        return media;
      }),
    );

    return (await mediaList).sort(() => 0.5 - Math.random()).slice(0, limit);
  }

  async getRandomSeries(limit: number): Promise<Media[]> {
    const randomSeries: Media[] = await this.sqliteService.getRandomMedia({
      type: 'series',
      count: limit,
    });

    return randomSeries;
  }

  async getLocal(type: string, page: number, search: string): Promise<Media[]> {
    const media: Media[] = await this.sqliteService.getMedia({
      type: type,
      page: page,
      local: true,
      search: search,
    });
    return media;
  }

  async getRandomLocalContent(type: string, limit: number): Promise<Media[]> {
    const randomLocalContent: Media[] = await this.sqliteService.getRandomMedia(
      {
        type: type,
        count: limit,
        local: true,
      },
    );

    return randomLocalContent;
  }
}
