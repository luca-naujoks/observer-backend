import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CheerioCrawler } from 'crawlee';
import { AppModule } from 'src/app.module';
import { Media } from 'src/enities/media.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

export async function collectTrendingMedia() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const sqliteService = app.get(SqliteService);

  const URLs = ['https://aniworld.to', 'https://s.to'];
  const trendingMedia: { stream_name: string; type: string }[] = [];

  const trendingCrawler = new CheerioCrawler({
    requestHandler: ({ $ }) => {
      const carousel = $('div.carousel').first();
      const elements = carousel.find('div.previews a');
      for (const element of elements.toArray()) {
        const stream_name = $(element).attr('href');
        if (stream_name) {
          trendingMedia.push({
            stream_name: stream_name.split('/')[3],
            type: stream_name.split('/')[1],
          });
        }
      }
    },
  });

  await trendingCrawler.run(URLs);
  for (const media of trendingMedia) {
    try {
      const media_id: Media = await sqliteService.findOne({
        stream_name: media.stream_name,
      });

      if (media_id && media_id.id) {
        await sqliteService.createTrending({
          media_id: media_id.id,
          type: media.type + (media.type === 'anime' ? '' : 's'),
        });
      }
    } catch (error) {
      Logger.warn(`Error in collectTrendingMedia: ${error}`);
    }
  }
}
