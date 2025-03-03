import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findMedia(
    type?: string,
    selectedFields?: (keyof Media)[],
  ): Promise<Media[]> {
    return this.mediaRepository.find({
      where: { type: type },
      select: selectedFields ? selectedFields : undefined,
    });
  }

  async findOneMedia(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
    });
    if (!media) {
      throw new NotFoundException(`Media with id ${id} not found`);
    }
    return media;
  }

  async findRandomMedia(type: string, count: number): Promise<Media[]> {
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

  async getTags(media_id: number): Promise<Tag[]> {
    return this.tagsRepository.find({
      where: { media_id: media_id },
      select: ['tag_id'],
    });
  }

  async createTag(tag: TagDto): Promise<Tag> {
    const newTag = this.tagsRepository.create(tag);
    return await this.tagsRepository.save(newTag);
  }

  async findTrending(): Promise<Trending[]> {
    return this.trendingRepository.find({
      select: ['media_id', 'type'],
    });
  }

  async createTrending(trending: TrendingDTO): Promise<Trending> {
    const newTrending = this.trendingRepository.create(trending);
    return await this.trendingRepository.save(newTrending);
  }

  async getLocalSeasons(media_id: number): Promise<LocalSeason[]> {
    return this.localSeasonsRepository.find({
      where: { media_id: media_id },
      select: ['season', 'episode', 'attention'],
    });
  }

  async createLocalSeason(localSeason: LocalSeasonDTO): Promise<LocalSeason> {
    const newLocalSeason = this.localSeasonsRepository.create(localSeason);
    return await this.localSeasonsRepository.save(newLocalSeason);
  }

  // Telemetrics an analytics

  async countMedia(type: string): Promise<number> {
    return this.mediaRepository.count({ where: { type: type } });
  }
}
