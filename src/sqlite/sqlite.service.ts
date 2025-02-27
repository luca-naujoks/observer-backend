import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findMedia(): Promise<Media[]> {
    return this.mediaRepository.find({ relations: ['tags', 'localSeasons'] });
  }

  async findOneMedia(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({
      where: { id },
      relations: ['tags', 'localSeasons'],
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

  async createMedia(media: Media): Promise<Media> {
    const newMedia = this.mediaRepository.create(media);
    return await this.mediaRepository.save(newMedia);
  }

  async createTag(tag: Tag): Promise<Tag> {
    const newTag = this.tagsRepository.create(tag);
    return await this.tagsRepository.save(newTag);
  }

  async createTrending(trending: Trending): Promise<Trending> {
    const newTrending = this.trendingRepository.create(trending);
    return await this.trendingRepository.save(newTrending);
  }

  async createLocalSeason(localSeason: LocalSeason) {
    const newLocalSeason = this.localSeasonsRepository.create(localSeason);
    return await this.localSeasonsRepository.save(newLocalSeason);
  }
}
