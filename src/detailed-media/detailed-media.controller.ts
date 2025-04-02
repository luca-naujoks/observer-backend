import { Controller, Get, Logger, Put, Query } from '@nestjs/common';
import {
  ApiAmbiguousResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { DetailedMediaService } from './detailed-media.service';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { Media } from 'src/enities/media.entity';

@Controller('detailed-media')
export class DetailedMediaController {
  constructor(
    private readonly detailedMediaService: DetailedMediaService,
    private readonly sqliteService: SqliteService,
  ) {}

  @Get()
  @ApiQuery({
    name: 'stream_name',
    type: String,
    example: 'gods-games-we-play',
    description: 'The Stream Name of the Media to get detailed information for',
  })
  @ApiOperation({
    summary: 'Request the Detailed Media Object of a specific Media',
  })
  @ApiOkResponse({
    description: 'The detailed media object was successfully returned',
  })
  @ApiAmbiguousResponse({
    description: 'The detailed media object was not found',
  })
  getDetailedMedia(@Query('stream_name') stream_name: string) {
    return this.detailedMediaService.getDetailedMedia(stream_name);
  }

  @Get('season')
  @ApiOperation({
    summary:
      'Request the Season Details of a specific Media by its TMDB ID and Season Number',
  })
  @ApiOkResponse({
    description: 'The detailed media object was successfully returned',
  })
  async getSeasonForMedia(
    @Query('tmdbID') tmdbID: number,
    @Query('seasonNumber') seasonNumber: number,
  ) {
    return this.detailedMediaService.getSeasonForMedia(tmdbID, seasonNumber);
  }

  @Get('tmdb-search')
  async getTmdbData(@Query('query') query: string) {
    return this.detailedMediaService.searchTMDB(query);
  }

  @Put('update-tmdb')
  async updateTmdbData(
    @Query('stream_name') stream_name: string,
    @Query('tmdb_id') tmdb_id: number,
  ) {
    const oldMedia: Media = await this.sqliteService.findOne({
      stream_name: stream_name,
    });
    if (!oldMedia) {
      console.error('Media not found:', stream_name);
      return;
    }
    const tmdbData = await this.detailedMediaService.getTmdbData(tmdb_id);
    if (!tmdbData) {
      console.error('TMDB data not found for ID:', tmdb_id);
      return;
    }
    const updatedMedia: Media = {
      ...oldMedia,
      tmdb_id: tmdbData.id,
      name: tmdbData.name,
      poster: 'https://image.tmdb.org/t/p/original' + tmdbData.poster_path,
      backdrop: 'https://image.tmdb.org/t/p/original' + tmdbData.backdrop_path,
    };

    Logger.log(updatedMedia);

    await this.sqliteService.updateMedia(updatedMedia);

    return updatedMedia;
  }
}
