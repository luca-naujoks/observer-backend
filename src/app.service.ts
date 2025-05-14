import { Injectable } from '@nestjs/common';
import { loadProviders } from './provider/loadProviders';
import { scheduleProviders } from './provider/scheduleProviders';

@Injectable()
export class AppService {
  async onApplicationBootstrap(): Promise<void> {
    try {
      await loadProviders();
      scheduleProviders();
    } catch (error) {
      console.error('Error during provider initialization:', error);
    }
  }
}
