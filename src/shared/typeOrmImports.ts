import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Media } from 'src/enities/media.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { Log } from 'src/enities/log.entity';
import { WatchlistItem } from 'src/enities/watchlist.entity';
import { Provider } from 'src/enities/provider.entity';

export const modules = [
  Media,
  LocalSeason,
  Tag,
  Trending,
  Log,
  WatchlistItem,
  Provider,
];
