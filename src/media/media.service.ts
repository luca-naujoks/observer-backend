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
    const media: Media[] = await this.sqliteService.findMedia(
      'anime',
      page,
      false,
    );
    return media;
  }

  async getSeries(page: number, search: string): Promise<Media[]> {
    this.logger.warn(
      search +
        ' is not passed to as a where prop to the sqlite database. still needs implementation',
    );
    const media: Media[] = await this.sqliteService.findMedia(
      'anime',
      page,
      false,
    );
    return media;
  }

  async getLocal(type: string, page: number, search: string): Promise<Media[]> {
    this.logger.warn(
      'There is a only local prop missing. aswell is the only local thing not implemented inside the sqliteService',
    );
    this.logger.warn(
      search +
        ' is not passed to as a where prop to the sqlite database. still needs implementation',
    );
    const media: Media[] = await this.sqliteService.findMedia(
      'anime',
      page,
      true,
    );
    return media;
  }
}
