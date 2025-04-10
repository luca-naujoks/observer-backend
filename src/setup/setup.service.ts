import { Injectable } from '@nestjs/common';

@Injectable()
export class SetupService {
  successfulMessage: string = '';

  async validateTmdbAPIKey(api_key: string): Promise<{
    fieldData: { TmdbApiKey: string };
    errors: { TmdbApiKey: boolean };
    messages: { TmdbApiKey: string };
  }> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`,
      },
    };
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/authentication',
        options,
      );
      if (response.status === 200) {
        return {
          fieldData: { TmdbApiKey: api_key },
          errors: { TmdbApiKey: false },
          messages: { TmdbApiKey: this.successfulMessage },
        };
      } else {
        return {
          fieldData: { TmdbApiKey: api_key },
          errors: { TmdbApiKey: true },
          messages: {
            TmdbApiKey: 'TmdbApiKey is invalid please provide a valid key',
          },
        };
      }
    } catch (error) {
      console.error('Failed to validate the TMDB API key:', error);
      return {
        fieldData: { TmdbApiKey: api_key },
        errors: { TmdbApiKey: true },
        messages: {
          TmdbApiKey: 'TmdbApiKey is invalid please provide a valid key',
        },
      };
    }
  }

  validateAnimeDir(animeDir: string): {
    fieldData: { AnimeDir: string };
    errors: { AnimeDir: boolean };
    messages: { AnimeDir: string };
  } {
    if (animeDir == '') {
      return {
        fieldData: { AnimeDir: animeDir },
        errors: { AnimeDir: true },
        messages: {
          AnimeDir: 'Anime Directory is invalid please provide a valid Dir',
        },
      };
    }
    return {
      fieldData: { AnimeDir: animeDir },
      errors: { AnimeDir: false },
      messages: { AnimeDir: this.successfulMessage },
    };
  }

  validateSeriesDir(seriesDir: string): {
    fieldData: { SeriesDir: string };
    errors: { SeriesDir: boolean };
    messages: { SeriesDir: string };
  } {
    if (seriesDir == '') {
      return {
        fieldData: { SeriesDir: seriesDir },
        errors: { SeriesDir: true },
        messages: {
          SeriesDir: 'Series Directory is invalid please provide a valid Dir',
        },
      };
    }
    return {
      fieldData: { SeriesDir: seriesDir },
      errors: { SeriesDir: false },
      messages: { SeriesDir: this.successfulMessage },
    };
  }

  validatePageSize(pageSize: number): {
    fieldData: { PageSize: number };
    errors: { PageSize: boolean };
    messages: { PageSize: string };
  } {
    if (pageSize <= 0) {
      return {
        fieldData: { PageSize: pageSize },
        errors: { PageSize: true },
        messages: {
          PageSize:
            'Page Size cant be 0 or smaller. Please provide a valid Page size',
        },
      };
    }
    return {
      fieldData: { PageSize: pageSize },
      errors: { PageSize: false },
      messages: { PageSize: this.successfulMessage },
    };
  }
}
