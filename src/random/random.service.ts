import { Injectable } from '@nestjs/common';
import { Media } from 'src/enities/media.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class RandomService {
  constructor(private readonly sqliteService: SqliteService) {}

  async getRandomAnimes(limit: number): Promise<Media[]> {
    const randomAnimes: Media[] = await this.sqliteService.getRandomMedia({
      type: 'anime',
      count: limit,
    });

    return randomAnimes;
  }

  async getRandomSeries(limit: number): Promise<Media[]> {
    const randomSeries: Media[] = await this.sqliteService.getRandomMedia({
      type: 'series',
      count: limit,
    });

    return randomSeries;
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
