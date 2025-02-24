import { Controller, Get, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TrendingService } from './trending.service';

@Controller('trending')
export class TrendingController {
  constructor(private readonly trendingService: TrendingService) {}

  @Get('animes')
  @ApiOperation({ summary: 'Get random Trending Anime based of the amount requested' })
  @ApiQuery({ name: 'amount', type: Number, example: 5, description: 'Number of items to return' })
  @ApiOkResponse({
    description: 'Get x random Anime of the 21 Trending ones',
  })
  getTrendingAnime(@Query('amount') limit: number) {
    return this.trendingService.getTrendingAnime(limit);
  }
  
  @Get('series')
  @ApiOperation({ summary: 'Get random Trending Series based of the amount requested'})
  @ApiQuery({ name: 'amount', type: Number, example: 5, description: 'Number of items to return' })
  @ApiOkResponse({
    description: 'Get x random Series of the 21 Trending ones',
  })
  getTrendingSeries(@Query('amount') limit: number) {
    return this.trendingService.getTrendingSerie(limit);
  }
}
