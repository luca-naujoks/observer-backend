import { Injectable, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { updateMedia } from './default-schedules/updateMedia';
import { collectTrendingMedia } from './default-schedules/collectTrendingMedia';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Injectable()
export class SchedulesService implements OnModuleInit {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly sqliteService: SqliteService,
  ) {}

  onModuleInit() {
    this.addTask({
      taskName: 'default-local-scanner',
      task: () => console.log('test'),
      schedule: '0 0 14 * * *',
    });
    this.addTask({
      taskName: 'default-scan-for-new-media',
      task: () => {
        updateMedia().catch(
          async (error) =>
            await this.sqliteService.createLog({
              type: 'error',
              user: 'system',
              message: `Error in Media update: ${error}`,
            }),
        );
        collectTrendingMedia().catch(
          async (error) =>
            await this.sqliteService.createLog({
              type: 'error',
              user: 'system',
              message: `Error in Trending collection: ${error}`,
            }),
        );
      },
      schedule: '0 0 14 * * *',
    });
    this.addTask({
      taskName: 'default-collect-trending-media',
      task: () => {
        collectTrendingMedia().catch(
          async (error) =>
            await this.sqliteService.createLog({
              type: 'error',
              user: 'system',
              message: `Error in Trending collection: ${error}`,
            }),
        );
      },
      schedule: '0 0 14 * * *',
    });
    this.addTask({
      taskName: 'default-scan-for-new-episodes',
      task: () => console.log('test'),
      schedule: '0 0 14 * * *',
    });
  }

  getAllTasks() {
    const jobs = this.schedulerRegistry.getCronJobs();
    const taskNames: { taskName: string; schedule: string }[] = [];
    jobs.forEach((value, key) => {
      return taskNames.push({
        taskName: key,
        schedule: value.cronTime.source.toString(),
      });
    });
    return taskNames;
  }

  getTask(taskName: string) {
    const job = this.schedulerRegistry.getCronJob(taskName);
    return { taskName: taskName, schedule: job.cronTime.source.toString() };
  }

  addTask({
    taskName,
    task,
    schedule,
  }: {
    taskName: string;
    task: (taskName: string) => void;
    schedule: string;
  }) {
    const job = new CronJob(schedule, task);
    this.schedulerRegistry.addCronJob(taskName, job);
    job.start();
  }

  removeTask(taskName: string) {
    this.schedulerRegistry.deleteCronJob(taskName);
  }

  updateTask(taskName: string, schedule: CronTime) {
    const job = this.schedulerRegistry.getCronJob(taskName);
    job.setTime(schedule);
  }

  async runTaskOnce(taskName: string) {
    const job = this.schedulerRegistry.getCronJob(taskName);
    await job.fireOnTick();
  }
}
