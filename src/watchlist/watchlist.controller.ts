import { Controller, Get, Post, Delete, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ConfigGuard } from 'src/shared/configuration.guard';
import { WatchlistService } from './watchlist.service';
import { Media } from 'src/enities/media.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@UseGuards(ConfigGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(
    private readonly watchListService: WatchlistService,
    private readonly sqliteService: SqliteService,
  ) {}

  @Get()
  async getWatchList(@Query('user') user: number): Promise<Media[]> {
    const mediaList: Media[] = [];
    const media_ids: number[] = await this.watchListService.getWatchList({
      user: user,
    });
    for (const media of media_ids) {
      mediaList.push(await this.sqliteService.getOneById({ id: media }));
    }
    return mediaList;
  }

  @Get('status')
  async watchListStatus(
    @Query('user') user: number,
    @Query('media_id') media_id: number,
  ) {
    return await this.watchListService.onWatchList({
      media_id: media_id,
      user: user,
    });
  }

  @Post()
  postWatchList(
    @Query('media_id') media_id: number,
    @Query('user') user: number,
  ) {
    return this.watchListService.createWatchListItems({
      media_id: media_id,
      user_id: user,
    });
  }

  @Delete()
  async putWatchList(
    @Query('media_id') media_id: number,
    @Query('user') user: number,
  ) {
    console.log('removing item');
    console.log(media_id);
    return this.watchListService.deleteWatchList({
      media_id: media_id,
      user_id: user,
    });
  }
}
