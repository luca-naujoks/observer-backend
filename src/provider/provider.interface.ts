import { Media } from 'src/enities/media.entity';

export interface Provider {
  name: string;
  fetchData(): Promise<Media[]>;
  trending?(): Promise<Media[]>;
  schedule: string;
  // request_url: string
}
