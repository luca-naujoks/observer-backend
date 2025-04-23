import { NestFactory } from '@nestjs/core';
import { CheerioCrawler } from 'crawlee';
import { AppModule } from 'src/app.module';
import { SqliteService } from 'src/sqlite/sqlite.service';

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

// Filtered Data
const newMedia: IMediaArrayItem[] = [];
const removedMedia: IMediaArrayItem[] = [];
const backOnlineMedia: IMediaArrayItem[] = [];

export async function scanForNewMedia() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sqliteService = app.get(SqliteService);

  // Get and Fill the Base Data constants
  await fillBaseMedia(sqliteService);

  // Compare the Base Data and Fill the Filtered Data constants

  // Insert new media into the database
  // Check for tmdb id
  // If found, get NeededData from tmdb
  // If not found, get NeededData from the website
  // Insert the new media into the database

  // Update removed Media in the database
  // update the online_available field to false

  // Update back online media in the database
  // update the online_available field to true

  // Write logs to the database
}

async function fillBaseMedia(sqliteService: SqliteService) {
  const mediaFromDB: IMediaArrayItem[] = await sqliteService.getAllMedia({
    selectedFields: ['stream_name', 'type'],
  });

  const mediaFromWeb: IMediaArrayItem[] = [];

  // run the crawler for aniworld or s.to
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
      url: 'https://aniworld.to/animes',
      label: 'aniworld',
    },
    {
      url: 'https://s.to/serien',
      label: 's.to',
    },
  ]);

  dbMedia.push(...mediaFromDB);
  onlineMedia.push(...mediaFromWeb);
}
