import { NestFactory } from '@nestjs/core';
import { CheerioCrawler } from 'crawlee';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { TagDto } from 'src/dtos/tag.dto';
import { Media } from 'src/enities/media.entity';
import { IBackendConfig } from 'src/OutputInterfaces';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { ISearchTvResponse, ITvSeriesDetails } from 'src/tmdbInterfaces';

interface IMediaArrayItem {
  stream_name: string;
  type: string;
}

// the data i need to be able to store a new item inside the database
interface INeededData {
  name: string;
  tags: number[];
  poster: string;
  backdrop: string;
}

// Base Data
const onlineMedia: IMediaArrayItem[] = [];
const dbMedia: IMediaArrayItem[] = [];
const removedDbMedia: IMediaArrayItem[] = [];

// Filtered Data
const newMedia: IMediaArrayItem[] = [];
const removedMedia: IMediaArrayItem[] = [];
const backOnlineMedia: IMediaArrayItem[] = [];

export async function generalMediaScan() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appConfig = AppService.getConfig();
  const sqliteService = app.get(SqliteService);

  // Get and Fill the Base Data constants
  await fillBaseMedia(sqliteService, await appConfig);

  // Compare the online media with the local media and find the new ones
  newMedia.push(
    ...onlineMedia.filter(
      (media) =>
        !dbMedia.some((dbItem) => dbItem.stream_name === media.stream_name),
    ),
  );

  // Compare the local media with the online media and find the removed ones
  removedMedia.push(
    ...dbMedia.filter(
      (media) =>
        !onlineMedia.some(
          (onlineItem) => onlineItem.stream_name === media.stream_name,
        ),
    ),
  );

  // Compare the online removed Media with online media to find wich are back online
  backOnlineMedia.push(
    ...removedDbMedia.filter((media) =>
      onlineMedia.some(
        (onlineItem) => onlineItem.stream_name === media.stream_name,
      ),
    ),
  );

  // Insert new media into the database
  for (const media of newMedia) {
    const tmdb_id: number = await istmdb_idAvailable(media.stream_name);

    if (tmdb_id !== 0) {
      //fetch the data from tmdb
      const tmdbCall: INeededData = await getTMDBData(tmdb_id);
      const mediaData: MediaObjectDTO = {
        type: media.type,
        tmdb_id: tmdb_id,
        stream_name: media.stream_name,
        name: tmdbCall.name,
        poster: tmdbCall.poster,
        backdrop: tmdbCall.backdrop,
        online_available: true,
      };
      const tagsData: number[] = tmdbCall.tags;
      await insertMediaData({
        media: mediaData,
        tags: tagsData,
        sqliteService: sqliteService,
      });
    } else {
      //fetch the data of aniworld or s.to
      const websiteCall: INeededData = await getWebData(
        media.type,
        media.stream_name,
      );
      const mediaData: MediaObjectDTO = {
        type: media.type,
        tmdb_id: tmdb_id,
        stream_name: media.stream_name,
        name: websiteCall.name,
        poster: websiteCall.poster,
        backdrop: websiteCall.backdrop,
        online_available: true,
      };
      const tagsData: number[] = websiteCall.tags;
      await insertMediaData({
        media: mediaData,
        tags: tagsData,
        sqliteService: sqliteService,
      });
    }
  }

  // Update removed Media in the database online_available -> false
  for (const media of removedMedia) {
    await updateOnlineAviable({
      sqliteService: sqliteService,
      stream_name: media.stream_name,
    });
  }

  // Update back online media in the database online_available -> true
  for (const media of backOnlineMedia) {
    await updateOnlineAviable({
      sqliteService: sqliteService,
      stream_name: media.stream_name,
    });
  }

  // Write logs to the database
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${newMedia.filter((media) => media.type == 'anime').length} new Animes`,
  });
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${backOnlineMedia.filter((media) => media.type == 'anime').length} Animes are back online`,
  });
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${removedMedia.filter((media) => media.type == 'anime').length} removed Animes`,
  });

  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${newMedia.filter((media) => media.type == 'series').length} new Series`,
  });
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${backOnlineMedia.filter((media) => media.type == 'series').length} Series are back online`,
  });
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${removedMedia.filter((media) => media.type == 'series').length} removed Series`,
  });
}

async function fillBaseMedia(
  sqliteService: SqliteService,
  appConfig: IBackendConfig,
) {
  const mediaFromDB: IMediaArrayItem[] = await sqliteService
    .getAllMedia({
      selectedFields: ['stream_name', 'type'],
      online_available: true,
    })
    .then((media) =>
      media.map((item) => ({
        stream_name: item.stream_name,
        type: item.type,
      })),
    );

  const mediaFromDBNotAvailable: IMediaArrayItem[] = await sqliteService
    .getAllMedia({
      selectedFields: ['stream_name', 'type'],
      online_available: false,
    })
    .then((media) =>
      media.map((item) => ({
        stream_name: item.stream_name,
        type: item.type,
      })),
    );

  const mediaFromWeb: IMediaArrayItem[] = [];

  // Crawler for aniworld.to & s.to
  // gets all the different shows available and ignores the anime genre of s.to.
  const mediaCrawler = new CheerioCrawler({
    requestHandler: ({ request, $ }) => {
      const genres = $('div.genre');
      for (const genre of genres.toArray()) {
        const genreName = $(genre).find('h3').text();
        if (request.label == 's.to' && genreName == 'Anime') {
          continue;
        }
        const elements = $(genre).find('ul li a');
        for (const element of elements.toArray()) {
          const stream_name = $(element).attr('href');
          if (stream_name) {
            mediaFromWeb.push({
              stream_name: stream_name.split('/')[3],
              type: request.label == 'aniworld' ? 'anime' : 'series',
            });
          }
        }
      }
    },
  });

  await mediaCrawler.run([
    {
      url: appConfig.AnimeUrl,
      label: 'aniworld',
    },
    {
      url: appConfig.SeriesUrl,
      label: 's.to',
    },
  ]);

  dbMedia.push(...mediaFromDB);
  onlineMedia.push(...mediaFromWeb);
  removedDbMedia.push(...mediaFromDBNotAvailable);
}

async function updateOnlineAviable({
  stream_name,
  sqliteService,
}: {
  stream_name: string;
  sqliteService: SqliteService;
}) {
  await sqliteService
    .getOne({ stream_name: stream_name })
    .then(async (media) => {
      media.online_available = !media.online_available;
      await sqliteService.updateMedia(media);
    });
}

// check if tmdb has a matching entry. returns the tmdb_id or 0 if not found
async function istmdb_idAvailable(stream_name: string): Promise<number> {
  const response: ISearchTvResponse = await request(stream_name);

  async function request(stream_name: string): Promise<ISearchTvResponse> {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${stream_name}&include_adult=true&language=en-US&page=1`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (await AppService.getConfig()).TmdbApiKey,
        },
      },
    );

    return (await response.json()) as ISearchTvResponse;
  }

  if (response.results.length <= 0) {
    return 0;
  } else {
    return response.results[0].id;
  }
}

async function getTMDBData(tmdb_id: number): Promise<INeededData> {
  const tmdbData = await requestTMDB<ITvSeriesDetails>();

  async function requestTMDB<ITvSeriesDetails>(): Promise<ITvSeriesDetails> {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${tmdb_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await AppService.getConfig()).TmdbApiKey,
      },
    });

    return (await response.json()) as ITvSeriesDetails;
  }

  return {
    name: tmdbData.name,
    tags: tmdbData.genres.map((genre) => genre.id),
    poster: 'https://image.tmdb.org/t/p/original' + tmdbData.poster_path,
    backdrop: 'https://image.tmdb.org/t/p/original' + tmdbData.backdrop_path,
  };
}

async function getWebData(
  type: string,
  stream_name: string,
): Promise<INeededData> {
  const extractedData: INeededData = {
    name: '',
    tags: [],
    poster: '',
    backdrop: '',
  };
  const url: string = `${type == 'anime' ? 'https://aniworld.to/anime/stream/' : 'https://s.to/serie/stream/'}${stream_name}`;
  const baseUrl: string =
    type == 'anime' ? 'https://aniworld.to' : 'https://s.to';

  const mediaCrawler = new CheerioCrawler({
    requestHandler: ({ $ }) => {
      const name: string = $('div.series-title').find('h1').text();
      const poster: string =
        $('div.seriesCoverBox').find('img').attr('data-src')?.trim() || '';
      const backdrop: string =
        $('div.backdrop')
          .attr('style')
          ?.match(/url\((['"]?)(.*?)\1\)/)?.[2] || '';
      extractedData.name = name;
      extractedData.poster = baseUrl + poster;
      extractedData.backdrop = baseUrl + backdrop;
    },
  });

  await mediaCrawler.run([url]);

  // Just dummy to satisfy the typescript compiler
  return extractedData;
}

async function insertMediaData({
  media,
  tags,
  sqliteService,
}: {
  media: MediaObjectDTO;
  tags: number[];
  sqliteService: SqliteService;
}) {
  const createdMedia: Media[] = await sqliteService.createMedia([media]);
  for (const tag of tags) {
    const newTag: TagDto = {
      media_id: createdMedia[0].id,
      tag_id: tag,
    };
    await sqliteService.createTag([newTag]);
  }
}
