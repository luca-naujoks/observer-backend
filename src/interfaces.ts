export interface IShow {
  type: string;
  tmdbID: number;
  streamName: string;
  name: string;
  tags: { id: number; name: string }[];
  poster: string;
  backdrop: string;
  localSeasons?: {
    season: number;
    episodes: number[];
  }[];
  onlineSeasons?: {
    season: number;
    episodes: number[];
  }[];
  state: string;
  hasErrors: boolean;

  vote_average: number;
  original_name: string;
  overview: string;
  original_language: string;
  first_air_date: string;
  status: string;
  episode_run_time: number;
  number_of_episodes: number;
  production_country: string;
  seasons: ItmdbSeasonObject[];
}

export interface ItmdbSeasonObject {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

export interface ItmdbData {
  tags: { id: number; name: string }[];
  vote_average: number;
  original_name: string;
  overview: string;
  original_language: string;
  first_air_date: string;
  status: string;
  episode_run_time: number;
  number_of_episodes: number;
  production_country: string;
  seasons: ItmdbSeasonObject[];
}

export interface MediaObject {
  name: string;
  seasons: { season: number; episodes: number[] }[];
}

// return interface for the season details eg. /tv/{tv_id}/season/{season_number}
export interface ISeasonDetails {
  _id: string;
  air_date: string;
  episodes: Episode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface CrewMember {
  job: string;
  department: string;
  credit_id: string;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

interface GuestStar {
  character: string;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

interface Episode {
  air_date: string;
  episode_number: number;
  episode_type: string;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
  crew: CrewMember[];
  guest_stars: GuestStar[];
}

// return interface for the tv details eg. /tv/{tv_id}
interface ICreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

interface IGenre {
  id: number;
  name: string;
}

interface ILastEpisodeToAir {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string;
}

interface INetwork {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface IProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}

interface ISeason {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
  vote_average: number;
}

interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ITvSeriesDetails {
  adult: boolean;
  backdrop_path: string;
  created_by: ICreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: IGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: ILastEpisodeToAir;
  name: string;
  next_episode_to_air: null | ILastEpisodeToAir;
  networks: INetwork[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  seasons: ISeason[];
  spoken_languages: ISpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

// return interface for the tv search eg. /search/tv
export interface ISearchTvResponse {
  page: number;
  results: Array<{
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string;
    name: string;
    vote_average: number;
    vote_count: number;
  }>;
  total_pages: number;
  total_results: number;
}

export interface Iconfig {
  CONFIGURED: boolean;
  MONGO_URI: string;
  RABBITMQ_URI: string;
  RABBITMQ_QUEUE: string;
  TMDB_API_KEY: string;
  LOCAL_ANIME_PATH: string;
  LOCAL_SERIES_PATH: string;
}

export interface IerrorObject {
  error: string;
  message: string;
}
