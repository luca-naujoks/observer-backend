import { SchedulerRegistry } from '@nestjs/schedule';
import { ExtendedProvider, Provider } from './provider.interface';
import { ProviderRegistry } from './provider.registry';
import { CronJob } from 'cron';
import { MediaArraySchema } from 'src/shared/zod.interfaces';
import { Logger } from '@nestjs/common';

import ivm from 'isolated-vm';

export function scheduleProviders(
  providerRegistry: ProviderRegistry,
  schedulerRegistry: SchedulerRegistry,
): void {
  const providers: ExtendedProvider[] = providerRegistry.listProviders();
  providers.forEach((provider) => {
    const job = new CronJob(provider.schedule, async () => {
      await jobExecutionWrapper({
        provider,
      });
    });
    schedulerRegistry.addCronJob(provider.name, job);
    if (provider.enabled) {
      job.start();
      Logger.log(`Scheduled provider with name: ${provider.name}`);
    } else {
      job.stop();
    }
  });
}

async function jobExecutionWrapper({
  provider,
}: {
  provider: Provider;
}): Promise<void> {
  const isolate = new ivm.Isolate({ memoryLimit: 128 }); // Limit memory usage to 128 MB
  const context = await isolate.createContext();
  const jail = context.global;

  const fetchDataWrapper = async () => {
    return await provider.fetchData();
  };

  // Set up the global object in the sandbox
  await jail.set('global', jail.derefInto());
  await jail.set('fetchData', new ivm.Reference(fetchDataWrapper));

  try {
    // Execute the fetchData function in the sandbox
    const result: unknown = await context.evalClosure(
      `
        async function executeFetch() {
          return await fetchData.apply(undefined, []);
        }
        executeFetch();
      `,
      [], // No arguments passed to the closure
      { timeout: 5000 }, // Timeout after 5 seconds
    );

    // Validate the result using Zod
    const parsedData = MediaArraySchema.safeParse(result);

    if (!parsedData.success) {
      Logger.error('Data Validation Failed');
      return;
    }

    Logger.log('Inserting data into DB');
    // TODO: Insert parsedData.data into the database
  } catch (error) {
    Logger.error('Job execution failed:', error);
  } finally {
    isolate.dispose(); // Clean up the isolate
  }
}
