import { Injectable, Logger } from '@nestjs/common';
import { Provider } from './provider.interface';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { ZProvider } from 'src/shared/zod.interfaces';

@Injectable()
export class ProviderRegistry {
  private static providers: Map<string, Provider> = new Map();

  constructor(private readonly sqliteService: SqliteService) {}

  static registerProvider(provider: Provider): void {
    const providerVadilityCheck = ZProvider.safeParse(provider);

    if (!providerVadilityCheck.success) {
      Logger.error(
        'Provider does not match the expected scheme please validate.',
      );
    }

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
