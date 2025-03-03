import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CheerioCrawler } from 'crawlee';
import { AppModule } from 'src/app.module';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { TagDto } from 'src/dtos/tag.dto';
import { SqliteService } from 'src/sqlite/sqlite.service';

export async function updateMedia() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sqliteService = app.get(SqliteService);

  const newMedia: { stream_name: string; type: string }[] = [];
  const removedMedia: { stream_name: string; type: string }[] = [];

  async function mediaComperator(url: string, type: string): Promise<void> {
    const localMedia: string[] = await sqliteService
      .findMedia(type, ['stream_name'])
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
            const streamName = $(element).attr('href');
            if (streamName) {
              onlineMedia.push(streamName.split('/')[3]);
            }
          }
        }
      },
    });

    await mediaCrawler.run([url]);

    // Compare the online media with the local media and find the new ones
    const newMediaItems: { stream_name: string; type: string }[] = onlineMedia
      .filter((media) => !localMedia.includes(media))
      .map((media) => ({ stream_name: media, type }));

    newMedia.push(...newMediaItems);

    // Compare the local media with the online media and find the removed ones
    const removedMediaItems = localMedia
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

  //check if there is a matching tmdb id for the media and run the according function

  // get and save the data from the tmdb api
  //function getTMDBData(tmdb_id: number) {}

  // scrape the needed data from the media stream site
  //function getMediaData(stream_name: string, type: string) {}

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
