import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { Media } from 'src/enities/media.entity';

ApiTags('Anisquid Observer');
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('animes')
  @ApiOperation({
    summary: 'Request a Page of Anime Media. Each Page contains 100 Items',
  })
  @ApiOkResponse({
    description: 'The page was successfully returned',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 0,
    description: 'Page number',
    required: true,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    example: 'Naruto',
    description: 'Search query',
    required: false,
  })
  async getAnimes(
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<Media[]> {
    return this.mediaService.getAnimes(page, search);
  }

  @Get('series')
  @ApiOperation({
    summary: 'Request a Page of Series Media. Each Page contains 100 Items',
  })
  @ApiOkResponse({
    description: 'The page was successfully returned',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 0,
    description: 'Page number',
    required: true,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    example: 'Simsalagrimm',
    description: 'Search query',
    required: false,
  })
  async getSeries(
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<Media[]> {
    return this.mediaService.getSeries(page, search);
  }

  @Get('local')
  @ApiOperation({
    summary:
      'Request a Page of Local Media by Type. Each Page contains 100 Items',
  })
  @ApiOkResponse({
    description: 'The page was successfully returned',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    example: 'anime',
    description: 'Type of media',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    example: 0,
    description: 'Page number',
    required: true,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    example: 'Simsalagrimm',
    description: 'Search query',
    required: false,
  })
  async getLocal(
    @Query('type') type: string,
    @Query('page') page: number,
    @Query('search') search: string,
  ): Promise<Media[]> {
    return this.mediaService.getLocal(type, page, search);
  }
}
