import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Provider } from './provider.interface';
import { ProviderRegistry } from './provider.regirsty';
import { register } from 'ts-node';

register();

const providersDir = path.resolve('storage/providers');

export async function loadProviders(): Promise<void> {
  if (!fs.existsSync(providersDir)) {
    Logger.log('provider path invalid');
    return;
  }

  const providerFiles = fs
    .readdirSync(providersDir)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const file of providerFiles) {
    const providerPath = path.join(providersDir, file);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const providerModule = await import(providerPath);
      const provider =
        (providerModule as { default?: Provider }).default ||
        (providerModule as Provider);

      if (!provider.name || typeof provider.fetchData !== 'function') {
        Logger.warn(`Invalid Provider in file ${file}`);
        continue;
      }
      ProviderRegistry.registerProvider(provider);
      Logger.log(`Loaded provider with name: ${provider.name}`);
    } catch (error) {
      Logger.warn(`Failed to load Provider in file ${file}: ${error}`);
    }
  }
}
