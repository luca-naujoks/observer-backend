import { ApiProperty } from '@nestjs/swagger';
import { IBackendConfig } from './OutputInterfaces';

export class ConfigDto implements IBackendConfig {
  @ApiProperty({
    description: 'The API Key for the TMDB API',
    example: '1234567890',
  })
  TmdbApiKey: string;

  @ApiProperty({
    description: 'The path to the local Anime Directory',
    example: '/anime',
  })
  AnimeDir: string;

  @ApiProperty({
    description: 'The url of the anime provider (usually aniworld.to)',
    example: 'https://aniworld.to',
  })
  AnimeUrl: string;

  @ApiProperty({
    description: 'The path to the local Series Directory',
    example: '/series',
  })
  SeriesDir: string;

  @ApiProperty({
    description: 'The url of the series provider (usually s.to)',
    example: 'https://s.to',
  })
  SeriesUrl: string;

  @ApiProperty({
    description: 'The Page Size used for paginated media',
    example: 100,
  })
  PageSize: number;
}
