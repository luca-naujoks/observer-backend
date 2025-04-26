import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrendingService } from './trending.service';
import { Media } from 'src/enities/media.entity';
import { ConfigGuard } from 'src/guards/configuration.guard';

@UseGuards(ConfigGuard)
@Controller('trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get('animes')
  @ApiOperation({
    summary: 'Get random Trending Anime based of the amount requested',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    example: 5,
    description: 'Number of items to return',
  })
  @ApiResponse({
    description: 'Get x random Anime of the 21 Trending ones',
  })
  getTrendingAnime(@Query('amount') limit: number): Promise<Media[]> {
    return this.trendingService.getTrendingAnime(limit);
  }

  @Get('series')
  @ApiOperation({
    summary: 'Get random Trending Series based of the amount requested',
  })
  @ApiQuery({
    name: 'amount',
    type: Number,
    example: 5,
    description: 'Number of items to return',
  })
  @ApiResponse({
    description: 'Get x random Series of the 21 Trending ones',
  })
  getTrendingSeries(@Query('amount') limit: number): Promise<Media[]> {
    return this.trendingService.getTrendingSerie(limit);
  }
}
