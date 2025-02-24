import { Controller, Get, Logger, Put, Query } from '@nestjs/common';
import {
  ApiAmbiguousResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { DetailedMediaService } from './detailed-media.service';

@Controller('detailed-media')
export class DetailedMediaController {
  constructor(private readonly detailedMediaService: DetailedMediaService) {}

  @Get()
  @ApiQuery({
    name: 'streamName',
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
  getDetailedMedia(@Query('streamName') streamName: string) {
    return this.detailedMediaService.getDetailedMedia(streamName);
  }

  @Get('season')
  @ApiOperation({
    summary: 'Request the Season Details of a specific Media by its TMDB ID and Season Number',
  })
  @ApiOkResponse({
    description: 'The detailed media object was successfully returned',
  })
  async getSeasonForMedia(@Query('tmdbID') tmdbID: number, @Query('seasonNumber') seasonNumber: number) {
    return this.detailedMediaService.getSeasonForMedia(tmdbID, seasonNumber);
  }

  @Get('tmdb-search')
  async getTmdbData(@Query('query') query: string) {
    return this.detailedMediaService.searchTMDB(query);
  }

  @Put('update-tmdb')
  async updateTmdbData(@Query('streamName') streamName: string, @Query('tmdbID') tmdbID: number) {
    console.log('Updating TMDB Data for Stream:', streamName, 'with TMDB ID:', tmdbID);
    return this.detailedMediaService.updateTMDB(streamName, tmdbID);
  }
}
