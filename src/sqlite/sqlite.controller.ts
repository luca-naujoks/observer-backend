import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SqliteService } from './sqlite.service';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { LocalSeason } from 'src/enities/localSeasons.entity';

@Controller('sqlite')
export class SqliteController {
  constructor(private readonly sqliteService: SqliteService) {}

  @Get('aggregated')
  async getRandomMedia(
    @Query('type') type: string,
    @Query('count') count: number,
  ) {
    return await this.sqliteService.findRandomMedia({
      type: type,
      count: count,
    });
  }

  @Get()
  async getMedia(@Query('stream_name') stream_name: string) {
    return await this.sqliteService.findOne({ stream_name: stream_name });
  }

  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    description: 'The type of media to get',
  })
  @Get('all')
  async getAllMedia(@Query('type') type: string) {
    return await this.sqliteService.findMedia({
      type: type,
      page: 0,
      local: false,
    });
  }

  @ApiBody({
    type: MediaObjectDTO,
    examples: {
      example1: {
        value: {
          type: 'anime',
          tmdb_id: 76059,
          stream_name: 'a-place-further-than-the-universe',
          name: 'A Place Further Than the Universe',
          poster:
            'https://image.tmdb.org/t/p/original/iERXyBf0K6DfAQ8oKEYrdjf1vIs.jpg',
          backdrop:
            'https://image.tmdb.org/t/p/original/bTIbUZVoKnlMt2IrZQv2ODPVs0N.jpg',
        },
      },
    },
  })
  @Post('media')
  async createMediaEntry(@Body() media: MediaObjectDTO) {
    return await this.sqliteService.createMedia(media);
  }

  @Get('tags')
  async getTags(@Query('media_id') media_id: number) {
    return await this.sqliteService.getTags({ media_id: media_id });
  }

  @ApiBody({
    type: Tag,
    examples: {
      example1: {
        value: {
          media_id: 1,
          tag_id: 1,
        },
      },
    },
  })
  @Post('tags')
  async createTag(@Body() tag: Tag) {
    return await this.sqliteService.createTag(tag);
  }

  @Get('trending')
  async getTrending(@Query('type') type: string) {
    return await this.sqliteService.findTrending({ mediaType: type });
  }

  @ApiBody({
    type: Trending,
    examples: {
      example1: {
        value: {
          media_id: 1,
          type: 'anime',
        },
      },
    },
  })
  @Post('trending')
  async createTrending(@Body() trending: Trending) {
    return await this.sqliteService.createTrending(trending);
  }

  @Get('localSeasons')
  async getLocalSeasons(@Query('media_id') media_id: number) {
    return await this.sqliteService.getLocalSeasons({ media_id: media_id });
  }
  @ApiBody({
    type: LocalSeason,
    examples: {
      example1: {
        value: {
          media_id: 1,
          season: 1,
          episode: 1,
          attention: false,
        },
      },
    },
  })
  @Post('localSeasons')
  async createLocalSeason(@Body() seasonObject: LocalSeason) {
    return await this.sqliteService.createLocalSeason(seasonObject);
  }

  // Telemetrics and analytics

  @Get('mediaCount')
  async countMedia(@Query('type') type: string) {
    return await this.sqliteService.countMedia({ type: type });
  }
}

// {
//   "type": "anime",
//   "tmdb_id": 76059,
//   "stream_name": "a-place-further-than-the-universe",
//   "name": "A Place Further Than the Universe",
//   "poster": "https: //image.tmdb.org/t/p/original/iERXyBf0K6DfAQ8oKEYrdjf1vIs.jpg",
//   "backdrop": "https: //image.tmdb.org/t/p/original/bTIbUZVoKnlMt2IrZQv2ODPVs0N.jpg"
// }
