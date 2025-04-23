import { NestFactory } from '@nestjs/core';
import { CheerioCrawler } from 'crawlee';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { TagDto } from 'src/dtos/tag.dto';
import { ISearchTvResponse, ITvSeriesDetails } from 'src/tmdbInterfaces';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { Media } from 'src/enities/media.entity';

interface INeededData {
  name: string;
  tags: number[];
  poster: string;
  backdrop: string;
}

export async function updateMedia() {
  const animeURL: string = 'https://aniworld.to//animes';
  const serienURL: string = 'https://s.to/serien';

  const app = await NestFactory.createApplicationContext(AppModule);
  const sqliteService = app.get(SqliteService);
  const newMedia: { stream_name: string; type: string }[] = [];
  const removedMedia: { stream_name: string; type: string }[] = [];
  const onlineRemovedMedia: { stream_name: string; type: string }[] = [];

  async function mediaComperator({
    url,
    type,
  }: {
    url: string;
    type: string;
  }): Promise<void> {
    const dbMedia: string[] = await sqliteService
      .getAllMedia({
        type: type,
        selectedFields: ['stream_name'],
      })
      .then((media) => media.map((media) => media.stream_name));

    const online_removed: string[] = await sqliteService
      .getAllMedia({
        type: type,
        online_available: false,
        selectedFields: ['stream_name'],
      })
      .then((media) => media.map((media) => media.stream_name));

    const onlineMedia: string[] = [];

    // Collect the online media data of aniworld and s.to. Also filter out the animes from s.to.
    const mediaCrawler = new CheerioCrawler({
      requestHandler: ({ $ }) => {
        const genres = $('div.genre');
        for (const genre of genres.toArray()) {
          const genreName = $(genre).find('h3').text();
          if (type == 'series' && genreName == 'Anime') {
            continue;
          }
          const elements = $(genre).find('ul li a');
          for (const element of elements.toArray()) {
            const stream_name = $(element).attr('href');
            if (stream_name) {
              onlineMedia.push(stream_name.split('/')[3]);
            }
          }
        }
      },
    });

    await mediaCrawler.run([url]);

    // Compare the online media with the local media and find the new ones
    const newMediaItems: { stream_name: string; type: string }[] = onlineMedia
      .filter((media) => !dbMedia.includes(media))
      .map((media) => ({ stream_name: media, type }));

    newMedia.push(...newMediaItems);

    // Compare the local media with the online media and find the removed ones
    const removedMediaItems = dbMedia
      .filter((media) => !onlineMedia.map((media) => media).includes(media))
      .map((stream_name) => ({ stream_name, type }));

    removedMedia.push(...removedMediaItems);

    // Compare the online removed Media with online media to find wich are back online
    const backOnlineMediaItems: { stream_name: string; type: string }[] =
      online_removed
        .filter((media) => onlineMedia.map((media) => media).includes(media))
        .map((stream_name) => ({ stream_name, type }));

    onlineRemovedMedia.push(...backOnlineMediaItems);
  }

  await mediaComperator({ url: animeURL, type: 'anime' });
  await mediaComperator({ url: serienURL, type: 'series' });

  // loop through all removed media and update the online_available property
  for (const media of removedMedia) {
    await updateOnlineAviable(media.stream_name);
  }

  // loop through all newMedia, collect aditional Details and insert them
  for (const media of newMedia) {
    const mediaObject: MediaObjectDTO = {
      type: media.type,
      tmdb_id: await istmdb_idAvailable(media.stream_name),
      stream_name: media.stream_name,
      name: '',
      poster: '',
      backdrop: '',
      online_available: true,
    };

    const tags: number[] = [];
    if (mediaObject.tmdb_id != 0) {
      const data = await getTMDBData(mediaObject.tmdb_id);
      mediaObject.name = data.name;
      mediaObject.poster = data.poster;
      mediaObject.backdrop = data.backdrop;
      tags.push(...data.tags);
    } else {
      const data = await collectMediaData(
        mediaObject.type,
        mediaObject.stream_name,
      );
      mediaObject.name = data.name;
      mediaObject.poster = data.poster;
      mediaObject.backdrop = data.backdrop;
      tags.push(...data.tags);
    }

    if (mediaObject.tmdb_id == 0) {
      continue;
    } else {
      await insertMediaData(mediaObject, tags);
    }
  }

  // loop through all online Removed media to check if they are available again
  for (const media of onlineRemovedMedia) {
    await updateOnlineAviable(media.stream_name);
  }

  async function istmdb_idAvailable(stream_name: string): Promise<number> {
    const response: ISearchTvResponse = await request(stream_name);

    async function request(stream_name: string): Promise<ISearchTvResponse> {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${stream_name}&include_adult=true&language=en-US&page=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + (await AppService.getConfig()).TmdbApiKey,
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

  // set the online_available property to false of passed stream_name
  async function updateOnlineAviable(stream_name: string) {
    await sqliteService
      .getOne({ stream_name: stream_name })
      .then(async (media) => {
        media.online_available = !media.online_available;
        await sqliteService.updateMedia(media);
      });
  }

  // get and return the data from the tmdb api
  async function getTMDBData(tmdb_id: number): Promise<INeededData> {
    const tmdbData = await requestTMDB<ITvSeriesDetails>();

    async function requestTMDB<ITvSeriesDetails>(): Promise<ITvSeriesDetails> {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tmdb_id}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + (await AppService.getConfig()).TmdbApiKey,
          },
        },
      );

      return (await response.json()) as ITvSeriesDetails;
    }

    return {
      name: tmdbData.name,
      tags: tmdbData.genres.map((genre) => genre.id),
      poster: 'https://image.tmdb.org/t/p/original' + tmdbData.poster_path,
      backdrop: 'https://image.tmdb.org/t/p/original' + tmdbData.backdrop_path,
    };
  }

  // scrape the needed data from aniworld or s.to and return it
  async function collectMediaData(
    type: string,
    stream_name: string,
  ): Promise<INeededData> {
    // Just dummy to satisfy the typescript compiler
    try {
      await sqliteService.getOne({ stream_name: stream_name });
    } catch {
      await sqliteService.createLog({
        type: 'Error',
        user: 'system',
        message: 'failed to collect Media from Website',
      });
    }
    return {
      name: '',
      tags: [],
      poster: '',
      backdrop: '',
    };
  }

  async function insertMediaData(media: MediaObjectDTO, tags: number[]) {
    const createdMedia: Media[] = await sqliteService.createMedia([media]);
    for (const tag of tags) {
      const newTag: TagDto = {
        media_id: createdMedia[0].id,
        tag_id: tag,
      };
      await sqliteService.createTag([newTag]);
    }
  }
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${newMedia.filter((media) => media.type == 'anime').length} new Animes`,
  });
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${onlineRemovedMedia.filter((media) => media.type == 'anime').length} Animes are back online`,
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
    message: `SheduledTask - ${onlineRemovedMedia.filter((media) => media.type == 'series').length} Series are back online`,
  });
  await sqliteService.createLog({
    type: 'info',
    user: 'service',
    message: `SheduledTask - ${removedMedia.filter((media) => media.type == 'series').length} removed Series`,
  });
}
