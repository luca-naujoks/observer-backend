import { SchedulerRegistry } from '@nestjs/schedule';
import { Provider } from './provider.interface';
import { ProviderRegistry } from './provider.regirsty';
import { CronJob } from 'cron';
import { Media } from 'src/enities/media.entity';
import { MediaArraySchema } from 'src/shared/zod.interfaces';
import { Logger } from '@nestjs/common';

export function scheduleProviders(): void {
  const providers: Provider[] = ProviderRegistry.listProviders();
  const schedulerRegistry: SchedulerRegistry = new SchedulerRegistry();

  providers.forEach((provider) => {
    if (provider.schedule) {
      const job = new CronJob(provider.schedule, async () => {
        const fetchedData = await provider.fetchData();
        jobExecutionWrapper({
          func: () => Promise.resolve(fetchedData),
        });
      });
      schedulerRegistry.addCronJob(provider.name, job);
      job.start();
    }
  });
}

function jobExecutionWrapper({ func }: { func: () => Promise<Media[]> }): void {
  func()
    .then((data) => {
      const parsedData = MediaArraySchema.safeParse(data);

      if (!parsedData.success) {
        Logger.error('Data Validation Failed');
        return;
      }
    })
    .catch((error) => {
      Logger.log('JobRun failed: ' + error);
    });
}
