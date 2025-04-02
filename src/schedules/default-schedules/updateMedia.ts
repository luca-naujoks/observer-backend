import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CheerioCrawler } from 'crawlee';
import { AppModule } from 'src/app.module';
import { AppService } from 'src/app.service';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { TagDto } from 'src/dtos/tag.dto';
import { ISearchTvResponse, ITvSeriesDetails } from 'src/interfaces';
import { SqliteService } from 'src/sqlite/sqlite.service';

interface INeededData {
  name: string;
  tags: number[];
  poster: string;
  backdrop: string;
}

export async function updateMedia() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sqliteService = app.get(SqliteService);
  const newMedia: { stream_name: string; type: string }[] = [];
  const removedMedia: { stream_name: string; type: string }[] = [];

  async function mediaComperator(url: string, type: string): Promise<void> {
    const dbMedia: string[] = await sqliteService
      .findAllMedia({
        type: type,
        selectedFields: ['stream_name'],
      })
      .then((media) => media.map((media) => media.stream_name));
    Logger.log('Found ' + dbMedia.length + ' ' + type);
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

    // Logger.log(
    //   newMedia.length + ` new ${type == 'anime' ? 'Animes' : 'Series'}`,
    // );
    // Logger.log(
    //   removedMedia.length + ` removed ${type == 'anime' ? 'Animes' : 'Series'}`,
    // );
  }

  await mediaComperator('https://aniworld.to/animes', 'anime');
  await mediaComperator('https://s.to/serien', 'series');

  // loop through all removed media and update the online_aviable property
  for (const media of removedMedia) {
    await updateOnlineAviable(media.stream_name);
  }

  for (const media of newMedia) {
    const mediaObject: MediaObjectDTO = {
      type: media.type,
      tmdb_id: await isTMDBIDAvailable(media.stream_name),
      stream_name: media.stream_name,
      name: '',
      poster: '',
      backdrop: '',
      online_aviable: true,
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
      Logger.log(
        'Inserted ' +
          mediaObject.type +
          ' ' +
          mediaObject.stream_name +
          ' with TMDB ID ' +
          mediaObject.tmdb_id,
      );
    }
  }

  async function isTMDBIDAvailable(stream_name: string): Promise<number> {
    const response: ISearchTvResponse = await request(stream_name);

    async function request(stream_name: string): Promise<ISearchTvResponse> {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?query=${stream_name}&include_adult=true&language=en-US&page=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer ' + (await AppService.getConfig()).TMDB_API_KEY,
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

  // set the online_aviable property to false of passed stream_name
  async function updateOnlineAviable(stream_name: string) {
    await sqliteService
      .findOne({ stream_name: stream_name })
      .then(async (media) => {
        media.online_aviable = false;
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
              'Bearer ' + (await AppService.getConfig()).TMDB_API_KEY,
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
      await sqliteService.findOne({ stream_name: stream_name });
    } catch (error) {
      Logger.warn(`Error in collectMediaData from website: ${error}`);
    }
    return {
      name: '',
      tags: [],
      poster: '',
      backdrop: '',
    };
  }

  async function insertMediaData(media: MediaObjectDTO, tags: number[]) {
    const createdMedia = await sqliteService.createMedia(media);
    for (const tag of tags) {
      const newTag: TagDto = {
        media_id: createdMedia.id,
        tag_id: tag,
      };
      await sqliteService.createTag(newTag);
    }
  }

  Logger.log(
    newMedia.filter((media) => media.type == 'anime').length + ' new Animes',
  );
  Logger.log(
    removedMedia.filter((media) => media.type == 'anime').length +
      ' removed Animes',
  );
  Logger.log(
    newMedia.filter((media) => media.type == 'series').length + ' new Series',
  );
  Logger.log(
    removedMedia.filter((media) => media.type == 'series').length +
      ' removed Series',
  );
}
