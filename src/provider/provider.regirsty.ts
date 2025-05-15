import { Injectable, Logger } from '@nestjs/common';
import { ExtendedProvider, Provider } from './provider.interface';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { ZProvider } from 'src/shared/zod.interfaces';

@Injectable()
export class ProviderRegistry {
  private static providers: Map<string, Provider> = new Map();

  constructor(private readonly sqliteService: SqliteService) {}

  async registerProvider(provider: Provider): Promise<void> {
    const providerVadilityCheck = ZProvider.safeParse(provider);

    if (!providerVadilityCheck.success) {
      Logger.error(
        'Provider does not match the expected scheme please validate.',
      );
    }

    if (ProviderRegistry.providers.has(provider.name)) {
      Logger.error(`Provider with id: ${provider.name} is already registered`);
      return;
    }

    const providerInDB = await this.sqliteService.provider.get(provider.name);
    if (providerInDB == null) {
      await this.sqliteService.provider.create({
        name: provider.name,
        enabled: true,
      });
    }

    ProviderRegistry.providers.set(provider.name, provider);
  }

  getProvider(name: string): Provider | undefined {
    return ProviderRegistry.providers.get(name);
  }

  async listProviders(): Promise<ExtendedProvider[]> {
    const providers: Provider[] = Array.from(
      ProviderRegistry.providers.values(),
    );
    const extendedProviders: ExtendedProvider[] = [];
    for (const provider of providers) {
      const enabledState = (await this.sqliteService.provider.get(
        provider.name,
      )) || { id: 0, name: 'error', enabled: false };
      extendedProviders.push({ ...provider, enabled: enabledState.enabled });
    }

    return extendedProviders;
  }

  toggleProvider(name: string) {
    return this.sqliteService.provider.toggle(name);
  }

  removeProvider(name: string): void {
    ProviderRegistry.providers.delete(name);
  }
}
