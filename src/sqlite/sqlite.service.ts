import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppService } from 'src/app.service';
import { LocalSeasonDTO } from 'src/dtos/localSeason.dto';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { TagDto } from 'src/dtos/tag.dto';
import { TrendingDTO } from 'src/dtos/trending.dto';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Media } from 'src/enities/media.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SqliteService {
  constructor(
    @InjectRepository(Media) private mediaRepository: Repository<Media>,
    @InjectRepository(Tag) private tagsRepository: Repository<Tag>,
    @InjectRepository(LocalSeason)
    private localSeasonsRepository: Repository<LocalSeason>,
    @InjectRepository(Trending)
    private trendingRepository: Repository<Trending>,
  ) {}

  async findMedia({
    type,
    page,
    local,
    selectedFields,
  }: {
    type: string;
    page: number;
    local: boolean;
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
        .where('media.id IN (:...media_ids)')
        .setParameters({ media_ids })
        .skip(page ? page * (await AppService.getConfig()).PAGE_SIZE : 0)
        .take((await AppService.getConfig()).PAGE_SIZE)
        .getMany();
    }
    return this.mediaRepository.find({
      where: { type: type },
      select: selectedFields ? selectedFields : undefined,
      skip: page ? page * (await AppService.getConfig()).PAGE_SIZE : 0,
      take: (await AppService.getConfig()).PAGE_SIZE,
    });
  }

  async findOne({ stream_name }: { stream_name: string }): Promise<Media> {
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

  async findOneById({ id }: { id: number }): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException(`Media with id ${id} not found`);
    }
    return media;
  }

  async updateMedia(media: MediaObjectDTO): Promise<Media> {
    await this.findOne({ stream_name: media.stream_name });
    return await this.mediaRepository.save(media);
  }

  async findRandomMedia({
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
        .where('media.id IN (:...media_ids)')
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

  async createMedia(media: MediaObjectDTO): Promise<Media> {
    const newMedia = this.mediaRepository.create(media);
    return await this.mediaRepository.save(newMedia);
  }

  async getTags({ media_id }: { media_id: number }): Promise<Tag[]> {
    return this.tagsRepository.find({
      where: { media_id: media_id },
      select: ['tag_id'],
    });
  }

  async createTag(tag: TagDto): Promise<Tag> {
    const newTag = this.tagsRepository.create(tag);
    return await this.tagsRepository.save(newTag);
  }

  async findTrending({
    mediaType,
  }: {
    mediaType: string;
  }): Promise<Trending[]> {
    return await this.trendingRepository.find({
      where: { type: mediaType },
    });
  }

  async createTrending(trending: TrendingDTO): Promise<Trending> {
    const newTrending = this.trendingRepository.create(trending);
    return await this.trendingRepository.save(newTrending);
  }

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

  async createLocalSeason(localSeason: LocalSeasonDTO): Promise<LocalSeason> {
    const newLocalSeason = this.localSeasonsRepository.create(localSeason);
    return await this.localSeasonsRepository.save(newLocalSeason);
  }

  // Telemetrics and analytics

  async countMedia({ type }: { type: string }): Promise<number> {
    return this.mediaRepository.count({ where: { type: type } });
  }
}
