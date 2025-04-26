import { CanActivate, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class ConfigGuard implements CanActivate {
  async canActivate(): Promise<boolean> {
    const configState = await AppService.getConfig();
    const configured: boolean =
      configState.TmdbApiKey.length > 0 &&
      configState.AnimeDir.length > 0 &&
      configState.SeriesDir.length > 0 &&
      configState.PageSize > 0;
    return configured;
  }
}
