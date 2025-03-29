import { Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { AppService } from 'src/app.service';
import { Media } from 'src/enities/media.entity';

import {
  ISearchTvResponse,
  ISeasonDetails,
  IShow,
  ItmdbData,
  ITvSeriesDetails,
} from 'src/interfaces';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class DetailedMediaService {
  constructor(private readonly sqliteService: SqliteService) {}

  async getSeasonForMedia(
    tmdbID: number,
    seasonNumber: number,
  ): Promise<ISeasonDetails> {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbID}/season/${seasonNumber}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + (await AppService.getConfig()).TMDB_API_KEY,
        },
      },
    );
    return (await response.json()) as ISeasonDetails;
  }

  async getDetailedMedia(stream_name: string): Promise<IShow> {
    let tmdbData: ItmdbData;

    const localData: Media = await this.sqliteService.findOne({
      stream_name: stream_name,
    });

    if (!localData) {
      throw new HttpErrorByCode[404]('Media not found');
    }

    if (localData.tmdb_id === 0) {
      const localDataObject: ItmdbData = {
        vote_average: 0,
        tags: [],
        original_name: 'N/A',
        overview: 'N/A',
        original_language: 'N/A',
        first_air_date: 'N/A',
        status: 'N/A',
        episode_run_time: 0,
        number_of_episodes: 0,
        production_country: 'N/A',
        seasons: [],
      };
      tmdbData = localDataObject;
    } else {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${localData.tmdb_id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + (await AppService.getConfig()).TMDB_API_KEY,
          },
        },
      );
      const data = (await response.json()) as ITvSeriesDetails;

      if (!data) {
        throw new HttpErrorByCode[404]('TMDB data not found');
      }

      tmdbData = {
        tags: data.genres || [],
        vote_average: data.vote_average || 0,
        original_name: data.original_name || 'N/A',
        overview: data.overview || 'N/A',
        original_language: data.original_language || 'N/A',
        first_air_date: data.first_air_date || 'N/A',
        status: data.status || 'N/A',
        episode_run_time:
          data.episode_run_time.length > 0 ? data.episode_run_time[0] : 0,
        number_of_episodes: data.number_of_episodes || 0,
        production_country:
          data.production_countries.length > 0
            ? data.production_countries[0].name
            : 'N/A',
        seasons: data.seasons || [],
      };
    }

    return {
      type: localData.type,
      tmdbID: localData.tmdb_id,
      stream_name: localData.stream_name,
      name: localData.name,
      tags: tmdbData.tags,
      poster: localData.poster,
      backdrop: localData.backdrop,
      localSeasons: undefined,
      onlineSeasons: undefined,
      state: 'online',
      hasErrors: false,

      vote_average: tmdbData?.vote_average,
      original_name: tmdbData.original_name,
      overview: tmdbData.overview,
      original_language: tmdbData.original_language,
      first_air_date: tmdbData.first_air_date,
      status: tmdbData.status,
      episode_run_time: tmdbData.episode_run_time,
      number_of_episodes: tmdbData.number_of_episodes,
      production_country: tmdbData.production_country,
      seasons: tmdbData.seasons,
    };
  }

  async searchTMDB(query: string): Promise<ISearchTvResponse['results']> {
    const tvResponse = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + (await AppService.getConfig()).TMDB_API_KEY,
        },
      },
    );

    const movieResponse = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer ' + (await AppService.getConfig()).TMDB_API_KEY,
        },
      },
    );

    const tvData = (await tvResponse.json()) as ISearchTvResponse;
    const movieData = (await movieResponse.json()) as ISearchTvResponse;

    return [...tvData.results, ...movieData.results];
  }
}
