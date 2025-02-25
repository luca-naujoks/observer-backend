import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RandomService } from './random.service';

@Controller('random')
export class RandomController {
  constructor(private readonly randomMedia: RandomService) {}

  @Get('animes')
  @ApiOperation({
    summary: 'Get the requested amout of random anime from the db',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    example: 5,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Get x random Anime',
  })
  getRandomAnimes(@Query('amount') limit: number) {
    return this.randomMedia.getRandomAnimes(limit);
  }

  @Get('series')
  @ApiOperation({
    summary: 'Get the requested amout of random series from the db',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    example: 5,
    description: 'Number of items to return',
  })
  @ApiOkResponse({
    description: 'Get x random Series',
  })
  getRandomSeries(@Query('amount') limit: number) {
    return this.randomMedia.getRandomSeries(limit);
  }

  @Get('local')
  @ApiOperation({
    summary: 'Get random Local Content based of the amount requested',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    example: 5,
    description: 'Number of items to return',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    example: 'anime',
    description: 'Type of content to return',
  })
  @ApiOkResponse({
    description: 'Get x random Local Content',
  })
  getRandomLocalContent(
    @Query('amount') limit: number,
    @Query('type') type: string,
  ) {
    return this.randomMedia.getRandomLocalContent(type, limit);
  }
}
