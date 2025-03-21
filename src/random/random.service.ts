import { Injectable } from '@nestjs/common';
import { Media } from 'src/enities/media.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class RandomService {
  constructor(private readonly sqliteService: SqliteService) {}

  async getRandomAnimes(limit: number): Promise<Media[]> {
    const randomAnimes: Media[] = await this.sqliteService.findRandomMedia({
      type: 'anime',
      count: limit,
    });

    return randomAnimes;
  }

  async getRandomSeries(limit: number): Promise<Media[]> {
    const randomSeries: Media[] = await this.sqliteService.findRandomMedia({
      type: 'series',
      count: limit,
    });

    return randomSeries;
  }

  async getRandomLocalContent(type: string, limit: number): Promise<Media[]> {
    const randomLocalContent: Media[] =
      await this.sqliteService.findRandomMedia({
        type: type,
        count: limit,
        local: true,
      });

    return randomLocalContent;
  }
}
