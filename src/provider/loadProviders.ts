import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Provider } from './provider.interface';
import { ProviderRegistry } from './provider.registry';
import { register } from 'ts-node';
import { ZProvider } from 'src/shared/zod.interfaces';

register();

const providersDir = path.resolve('storage/providers');

export async function loadProviders(
  providerRegistry: ProviderRegistry,
): Promise<void> {
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

      const providerVadilityCheck = ZProvider.safeParse(provider);

      if (!providerVadilityCheck.success) {
        Logger.warn(`Invalid Provider in file ${file}`);
        continue;
      }

      await providerRegistry.registerProvider(provider);
      Logger.log(`Registered provider with name: ${provider.name}`);
    } catch (error) {
      Logger.warn(`Failed to load Provider in file ${file}: ${error}`);
    }
  }
}
