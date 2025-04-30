import { Injectable } from '@nestjs/common';
import { WatchListDto } from 'src/dtos/watchlist.dto';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class WatchlistService {
  constructor(private readonly sqliteService: SqliteService) {}

  // returns media_ids[] from given user
  async getWatchList({ user }: { user: number }) {
    const watchListItems: number[] = await this.sqliteService.getWatchList({
      user: user,
    });

    return watchListItems;
  }

  // return a boolean based of if a medium is marked on the watchlist
  async onWatchList({
    media_id,
    user,
  }: {
    media_id: number;
    user: number;
  }): Promise<boolean> {
    const watchList: number[] = await this.getWatchList({ user: user });
    return watchList.includes(Number(media_id));
  }

  // takes a user_id & media_id to create a new watchList item
  async createWatchListItems({
    media_id,
    user_id,
  }: {
    media_id: number;
    user_id: number;
  }) {
    const watchListItem: WatchListDto = { media_id: media_id, user: user_id };
    await this.sqliteService.createWatchListItem(watchListItem);
  }

  // takes a user_id & media_id to delete a watchList item
  async deleteWatchList({
    media_id,
    user_id,
  }: {
    media_id: number;
    user_id: number;
  }) {
    const watchListItem: WatchListDto = { media_id: media_id, user: user_id };
    await this.sqliteService.deleteWatchListItem(watchListItem);
  }
}
