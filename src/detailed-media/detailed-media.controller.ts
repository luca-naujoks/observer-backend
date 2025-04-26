import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiAmbiguousResponse,
  ApiResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { DetailedMediaService } from './detailed-media.service';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { Media } from 'src/enities/media.entity';
import { IDetailedMedia, ISeason } from 'src/OutputInterfaces';
import { ConfigGuard } from 'src/guards/configuration.guard';

@UseGuards(ConfigGuard)
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
  @ApiResponse({
    description: 'The detailed media object was successfully returned',
  })
  @ApiAmbiguousResponse({
    description: 'The detailed media object was not found',
  })
  getDetailedMedia(@Query('stream_name') stream_name: string) {
    return this.detailedMediaService.getDetailedMedia(stream_name);
  }

  //TODO modify to return the new season object that only contains the episodes
  //Modified ;)
  @Get('season')
  @ApiOperation({
    summary:
      'Request the Season Details of a specific Media by its TMDB ID and Season Number',
  })
  @ApiResponse({
    description: 'The detailed media object was successfully returned',
  })
  async getSeasonForMedia(
    @Query('tmdb_id') tmdb_id: number,
    @Query('seasonNumber') seasonNumber: number,
  ): Promise<ISeason> {
    return this.detailedMediaService.getSeasonForMedia(tmdb_id, seasonNumber);
  }

  //TODO modify to return detailedMedia Objects
  @ApiOperation({
    summary: 'Search tmdb and get a list of type Media as return',
  })
  @Get('search')
  async getTmdbData(@Query('query') query: string): Promise<IDetailedMedia[]> {
    return this.detailedMediaService.searchTMDB(query);
  }

  @ApiOperation({
    summary:
      'Update tmdb_id, name, poster and backdrop my passing a new tmdb_id',
  })
  @ApiResponse({
    description: 'Returns the upadted Media object',
  })
  @Put('update-tmdb')
  async updateTmdbData(
    @Query('stream_name') stream_name: string,
    @Query('tmdb_id') tmdb_id: number,
  ) {
    const oldMedia: Media = await this.sqliteService.getOne({
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
      poster: tmdbData.poster_path,
      backdrop: tmdbData.backdrop_path,
    };

    await this.sqliteService.createLog([
      {
        type: 'info',
        user: 'system',
        message: `Updated ${updatedMedia.stream_name}, new tmdb_id: ${updatedMedia.tmdb_id}`,
      },
    ]);

    await this.sqliteService.updateMedia(updatedMedia);

    return updatedMedia;
  }
}
