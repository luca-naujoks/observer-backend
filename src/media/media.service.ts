import { Injectable, Logger } from '@nestjs/common';
import { Media } from 'src/enities/media.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class MediaService {
  constructor(private readonly sqliteService: SqliteService) {}

  logger = new Logger();

  async getAnimes(page: number, search: string): Promise<Media[]> {
    this.logger.warn(
      search +
        ' is not passed to as a where prop to the sqlite database. still needs implementation',
    );
    const media: Media[] = await this.sqliteService.findMedia({
      type: 'anime',
      page: page,
      local: false,
      search: search,
    });
    return media;
  }

  async getSeries(page: number, search: string): Promise<Media[]> {
    this.logger.warn(
      search +
        ' is not passed to as a where prop to the sqlite database. still needs implementation',
    );
    const media: Media[] = await this.sqliteService.findMedia({
      type: 'series',
      page: page,
      local: false,
      search: search,
    });
    return media;
  }

  async getLocal(type: string, page: number, search: string): Promise<Media[]> {
    this.logger.warn(
      search +
        ' is not passed to as a where prop to the sqlite database. still needs implementation',
    );
    const media: Media[] = await this.sqliteService.findMedia({
      type: type,
      page: page,
      local: true,
      search: search,
    });
    return media;
  }
}
