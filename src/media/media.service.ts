import { Injectable } from '@nestjs/common';
import { Media } from 'src/enities/media.entity';
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

  async getSeries(page: number, search: string): Promise<Media[]> {
    const media: Media[] = await this.sqliteService.getMedia({
      type: 'series',
      page: page,
      local: false,
      search: search,
    });
    return media;
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
}
