import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalSeasonDTO } from 'src/dtos/localSeason.dto';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { TagDto } from 'src/dtos/tag.dto';
import { TrendingDTO } from 'src/dtos/trending.dto';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { LogDto } from 'src/dtos/log.dto';
import { Log } from 'src/enities/log.entity';
import { Media } from 'src/enities/media.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { Repository } from 'typeorm';
import { WatchlistItem } from 'src/enities/watchlist.entity';
import { WatchListDto } from 'src/dtos/watchlist.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqliteService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    @InjectRepository(LocalSeason)
    private localSeasonsRepository: Repository<LocalSeason>,
    @InjectRepository(Trending)
    private trendingRepository: Repository<Trending>,
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
    @InjectRepository(WatchlistItem)
    private watchListRepository: Repository<WatchlistItem>,
    private readonly configService: ConfigService,
  ) {}

  // Media

  async getAllMedia({
    type,
    online_available,
    selectedFields,
  }: {
    type?: string;
    online_available?: boolean;
    selectedFields?: (keyof Media)[];
  }): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { type: type, online_available: !online_available },
      select: selectedFields ? selectedFields : undefined,
    });
  }

  async getMedia({
    type,
    page,
    local,
    search,
    selectedFields,
  }: {
    type: string;
    page: number;
    local: boolean;
    search?: string;
    selectedFields?: (keyof Media)[];
  }): Promise<Media[]> {
    if (local) {
      const mediaIds = (await this.localSeasonsRepository
        .createQueryBuilder('ls')
        .select('DISTINCT ls.media_id')
        .execute()) as Array<{ media_id: string }>;

      const media_ids = mediaIds.map((item) => item.media_id);

      return this.mediaRepository
        .createQueryBuilder('media')
        .where('media.type = :type', { type })
        .andWhere('media.id IN (:...media_ids)')
        .setParameters({ media_ids })
        .andWhere('media.name LIKE :name', {
          name: `%${search ? search : ''}%`,
        })
        .skip(
          page ? page * (this.configService.get<number>('PageSize') ?? 10) : 0,
        )
        .take(this.configService.get<number>('PageSize'))
        .getMany();
    }
    return this.mediaRepository
      .createQueryBuilder('media')
      .where('media.type = :type', { type })
      .andWhere('media.name LIKE :name', { name: search ? `%${search}%` : '%' })
      .skip(
        page ? page * (this.configService.get<number>('PageSize') ?? 10) : 0,
      )
      .take(this.configService.get<number>('PageSize'))
      .addSelect(
        selectedFields ? selectedFields.map((field) => `media.${field}`) : [],
      )
      .getMany();
  }

  async getOne({ stream_name }: { stream_name: string }): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { stream_name },
    });
    if (!media) {
      throw new NotFoundException(
        `Media with stream_name ${stream_name} not found`,
      );
    }
    return media;
  }

  async getOneById({ id }: { id: number }): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException(`Media with id ${id} not found`);
    }
    return media;
  }

  async getByTmdbID({ tmdb_id }: { tmdb_id: number }): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { tmdb_id: tmdb_id },
    });
    if (!media) {
      throw new NotFoundException(`Media with id ${tmdb_id} not found`);
    }
    return media;
  }

  async updateMedia(media: MediaObjectDTO): Promise<Media> {
    await this.getOne({ stream_name: media.stream_name });
    return await this.mediaRepository.save(media);
  }

  async getRandomMedia({
    type,
    count,
    local,
  }: {
    type: string;
    count: number;
    local?: boolean;
  }): Promise<Media[]> {
    if (local) {
      const mediaIds = (await this.localSeasonsRepository
        .createQueryBuilder('ls')
        .select('DISTINCT ls.media_id')
        .execute()) as Array<{ media_id: string }>;

      const media_ids = mediaIds.map((item) => item.media_id);

      return await this.mediaRepository
        .createQueryBuilder('media')
        .where('media.type = :type', { type })
        .andWhere('media.id IN (:...media_ids)')
        .setParameters({ media_ids })
        .orderBy('RANDOM()')
        .limit(count)
        .getMany();
    }

    return await this.mediaRepository
      .createQueryBuilder('media')
      .where('media.type = :type', { type })
      .orderBy('RANDOM()')
      .limit(count)
      .getMany();
  }

  async createMedia(media: MediaObjectDTO[]): Promise<Media[]> {
    const newMedia = this.mediaRepository.create(media);
    return await this.mediaRepository.save(newMedia);
  }

  // Tags

  async getTags({ media_id }: { media_id: number }): Promise<Tag[]> {
    return this.tagsRepository.find({
      where: { media_id: media_id },
      select: ['tag_id'],
    });
  }

  async createTag(tag: TagDto[]): Promise<Tag[]> {
    const newTag = this.tagsRepository.create(tag);
    return await this.tagsRepository.save(newTag);
  }

  // Trending

  async getTrending({ mediaType }: { mediaType: string }): Promise<Trending[]> {
    return await this.trendingRepository.find({
      where: { type: mediaType },
    });
  }

  async createTrending(trending: TrendingDTO[]): Promise<Trending[]> {
    const newTrending = this.trendingRepository.create(trending);
    return await this.trendingRepository.save(newTrending);
  }

  // Local Seasons

  async getLocalSeasons({
    media_id,
  }: {
    media_id: number;
  }): Promise<LocalSeason[]> {
    return this.localSeasonsRepository.find({
      where: { media_id: media_id },
      select: ['season', 'episode', 'attention'],
    });
  }

  async checkLocalEpisode({
    media_id,
    season_number,
    episode_number,
  }: {
    media_id: number;
    season_number: number;
    episode_number: number;
  }): Promise<boolean> {
    const isEpisodeLocalAvailable = await this.localSeasonsRepository.findOne({
      where: {
        media_id: media_id,
        season: season_number,
        episode: episode_number,
      },
    });

    return isEpisodeLocalAvailable ? true : false;
  }

  async createLocalSeason(
    localSeason: LocalSeasonDTO[],
  ): Promise<LocalSeason[]> {
    const newLocalSeason = this.localSeasonsRepository.create(localSeason);
    return await this.localSeasonsRepository.save(newLocalSeason);
  }

  async clearTrendingMediaTable() {
    return await this.trendingRepository.clear();
  }

  // Audit and Logs

  async getLogs({
    timestampFrom,
    timestampTill,
    type,
    user,
  }: {
    timestampFrom?: Date;
    timestampTill?: Date;
    type?: string;
    user?: string;
  }): Promise<Log[]> {
    const queryBuilder = this.logRepository.createQueryBuilder('log');

    if (timestampFrom) {
      queryBuilder.andWhere('log.timestamp >= :timestampFrom', {
        timestampFrom: timestampFrom,
      });
    }
    if (timestampTill) {
      queryBuilder.andWhere('log.timestamp <= :timestampTill', {
        timestampTill: timestampTill,
      });
    }
    if (type) {
      queryBuilder.andWhere('log.type = :type', { type: type });
    }

    if (user) {
      queryBuilder.andWhere('log.user = :user', { user: user });
    }

    return queryBuilder.getMany();
  }

  async createLog(logs: LogDto[] | LogDto): Promise<Log[]> {
    if (!Array.isArray(logs)) {
      logs = [logs];
    }
    const newLogs = this.logRepository.create(
      logs.map((log) => ({ ...log, timestamp: new Date() })),
    );
    return await this.logRepository.save(newLogs);
  }

  // WatchList

  async getWatchList({ user }: { user: number }): Promise<number[]> {
    const media_ids: { watchlist_media_id: number }[] =
      await this.watchListRepository
        .createQueryBuilder('watchlist')
        .where('watchlist.user = :user', { user: user })
        .select(['watchlist.media_id AS watchlist_media_id'])
        .getRawMany();

    return media_ids.map(
      (item: { watchlist_media_id: number }) => item.watchlist_media_id,
    );
  }

  async createWatchListItem(
    watchListItem: WatchListDto,
  ): Promise<WatchlistItem> {
    console.log('create w list item');
    console.log(watchListItem);
    const newWatchListItem = this.watchListRepository.create(watchListItem);
    return await this.watchListRepository.save(newWatchListItem);
  }

  async deleteWatchListItem(watchListItem: WatchListDto) {
    await this.watchListRepository.delete({
      media_id: watchListItem.media_id,
      user: watchListItem.user,
    });
  }

  // Telemetrics and analytics

  async countMedia({ type }: { type: string }): Promise<number> {
    return this.mediaRepository.count({ where: { type: type } });
  }
}
