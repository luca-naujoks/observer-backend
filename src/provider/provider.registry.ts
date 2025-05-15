import { Injectable, Logger } from '@nestjs/common';
import { ExtendedProvider, Provider } from './provider.interface';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { ZProvider } from 'src/shared/zod.interfaces';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class ProviderRegistry {
  private static providers: Map<string, ExtendedProvider> = new Map();

  constructor(
    private readonly sqliteService: SqliteService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async registerProvider({
    provider,
    filePath,
  }: {
    provider: Provider;
    filePath: string;
  }): Promise<void> {
    const providerValidityCheck = ZProvider.safeParse(provider);

    if (!providerValidityCheck.success) {
      Logger.error(
        'Provider does not match the expected scheme please validate.',
      );
      return;
    }

    if (ProviderRegistry.providers.has(provider.name)) {
      Logger.error(`Provider with id: ${provider.name} is already registered`);
      return;
    }

    let providerInDB = await this.sqliteService.provider.get(provider.name);
    if (providerInDB == null) {
      const newEntry = await this.sqliteService.provider.create({
        name: provider.name,
        enabled: true,
      });
      providerInDB = newEntry;
    }

    ProviderRegistry.providers.set(provider.name, {
      ...provider,
      file_path: filePath,
      enabled: providerInDB.enabled,
    });
  }

  getProvider(name: string): Provider | undefined {
    return ProviderRegistry.providers.get(name);
  }

  listProviders(): ExtendedProvider[] {
    const providers: ExtendedProvider[] = Array.from(
      ProviderRegistry.providers.values(),
    );

    return providers;
  }

  async toggleProvider(name: string): Promise<ExtendedProvider | void> {
    if (!ProviderRegistry.providers.has(name)) {
      Logger.error(`Provider with id: ${name} does not exist`);
      return;
    }
    try {
      const provider: ExtendedProvider = ProviderRegistry.providers.get(name)!; // Enforced that there is a return cause we checked earlier that a item with that name exists ;)
      provider.enabled = !provider.enabled;
      await this.sqliteService.provider.toggle(name);
      ProviderRegistry.providers.set(name, provider);
      switch (true) {
        case provider.enabled:
          this.schedulerRegistry.getCronJob(provider.name).start();
          break;
        case !provider.enabled:
          this.schedulerRegistry.getCronJob(provider.name).stop();
          break;
      }
      return provider;
    } catch (error) {
      Logger.error(`Failed to toggle provider ${name}: ${error}`);
      throw error;
    }
  }

  async removeProvider(name: string): Promise<void> {
    const exists = ProviderRegistry.providers.delete(name);
    if (exists) {
      try {
        await this.sqliteService.provider.delete(name);
      } catch (error) {
        Logger.error(
          `Failed to delete provider ${name} from database: ${error}`,
        );
      }
    }
  }
}
