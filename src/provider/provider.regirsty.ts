import { Logger } from '@nestjs/common';
import { Provider } from './provider.interface';

export class ProviderRegistry {
  private static providers: Map<string, Provider> = new Map();

  static registerProvider(provider: Provider): void {
    if (this.providers.has(provider.name)) {
      Logger.error(`Provider with id: ${provider.name} is already registered`);
      return;
    }
    this.providers.set(provider.name, provider);
  }
  static getProvider(id: string): Provider | undefined {
    return this.providers.get(id);
  }

  static listProviders(): Provider[] {
    return Array.from(this.providers.values());
  }

  static removeProvider(id: string): void {
    this.providers.delete(id);
  }
}
