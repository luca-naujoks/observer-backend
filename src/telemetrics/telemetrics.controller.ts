import { Controller, Get } from '@nestjs/common';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Controller('telemetrics')
export class TelemetricsController {
  constructor(private readonly sqliteService: SqliteService) {}

  @Get('anime')
  async countAnimeInDB() {
    return await this.sqliteService.countMedia({ type: 'anime' });
  }

  @Get('series')
  async countSeriesInDB() {
    return await this.sqliteService.countMedia({ type: 'series' });
  }
}
