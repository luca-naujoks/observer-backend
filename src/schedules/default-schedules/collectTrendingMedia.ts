import { CheerioCrawler } from 'crawlee';

export async function collectTrendingMedia() {
  const URLs = ['https://aniworld.to', 'https://s.to'];

  const trendingCrawler = new CheerioCrawler({
    requestHandler: ({ $ }) => {
      const carousel = $('div.carousel').first();
      const elements = carousel.find('div.previews a');
      for (const element of elements.toArray()) {
        const name = $(element).find('h3').text();
        const stream_name = $(element).attr('href');
        console.log(name, stream_name);
      }
    },
  });

  await trendingCrawler.run(URLs);
}
