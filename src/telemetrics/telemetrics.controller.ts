import { Controller, Get } from '@nestjs/common';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Controller('telemetrics')
export class TelemetricsController {
  constructor(private readonly sqliteService: SqliteService) {}

  @Get('anime')
  async countAnimeInDB(): Promise<number> {
    return this.sqliteService.telemetrics.countMedia({ type: 'anime' });
  }

  @Get('series')
  async countSeriesInDB(): Promise<number> {
    return this.sqliteService.telemetrics.countMedia({ type: 'series' });
  }
}
