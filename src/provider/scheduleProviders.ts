import { SchedulerRegistry } from '@nestjs/schedule';
import { Provider } from './provider.interface';
import { ProviderRegistry } from './provider.regirsty';
import { CronJob } from 'cron';
import { MediaArraySchema } from 'src/shared/zod.interfaces';
import { Logger } from '@nestjs/common';

import ivm from 'isolated-vm';

export function scheduleProviders(): void {
  const providers: Provider[] = ProviderRegistry.listProviders();
  const schedulerRegistry: SchedulerRegistry = new SchedulerRegistry();

  providers.forEach((provider) => {
    if (provider.schedule) {
      const job = new CronJob(provider.schedule, async () => {
        await jobExecutionWrapper({
          provider,
        });
      });
      schedulerRegistry.addCronJob(provider.name, job);
      job.start();
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
