export interface Provider {
  id: string;
  name: string;
  fetchData(): Promise<any>;
  schedule?: string;
}
