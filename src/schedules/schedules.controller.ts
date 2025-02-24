import { Controller, Delete, Get, Logger, Post, Put, Query } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CronTime } from 'cron';
import { SchedulesService } from './schedules.service';

@Controller('schedules')
export class SchedulesController {
  private readonly logger = new Logger('SchedulesController');

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private readonly scheduleService: SchedulesService,
  ) {}


  @ApiOperation({
    summary: 'Get a scheduled task',
  })
  @ApiQuery({
    name: 'jobName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to',
    })
  @Get('task')
    async getTask(@Query('jobName') jobName: string) {
        return this.scheduleService.getTask(jobName);
    }

  @ApiOperation({
    summary: 'List all scheduled tasks',
  })
  @Get()
  async listScheduledTasks() {
    return this.scheduleService.getAllTasks();
  }

  @ApiOperation({
    summary: 'Add a new Dummy Scheduled Task',
  })
  @ApiQuery({
    name: 'time',
    type: String,
    example: '5 * * * * *',
    description: 'The cron schedule for the job',
  })
  @ApiQuery({
    name: 'jobName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to add',
  })
  @Post()
  async addScheduledTask(
    @Query('time') time: string,
    @Query('jobName') jobName: string,
  ) {
    function task() {
      this.logger.warn(`Cron job: ${jobName} running`);
    }

    this.scheduleService.addTask({
      taskName: jobName,
      task: task,
      schedule: time,
    });

    return HttpErrorByCode[201];
  }

  @ApiOperation({
    summary: 'Edit the schedule of a cron job',
  })
  @ApiQuery({
    name: 'jobName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to modify',
  })
  @ApiQuery({
    name: 'time',
    type: String,
    example: '5 * * * * *',
    description: 'The new cron schedule for the job',
  })
  @Put() // Edit the cron schedule
  async editScheduledTask(
    @Query('time') time: string,
    @Query('jobName') jobName: string,
  ) {
    const cronTime = new CronTime(time);
    await this.scheduleService.updateTask(jobName, cronTime);
    return HttpErrorByCode[200];
  }

  @ApiOperation({
    summary: 'Remove a scheduled task',
  })
  @ApiQuery({
    name: 'jobName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to remove',
  })
  @Delete()
  async removeScheduledTask(@Query('jobName') jobName: string) {
    this.scheduleService.removeTask(jobName);
    return HttpErrorByCode[204];
  }

  @Post('run-task-now')
  async runTaskOnce(@Query('jobName') jobName: string) {
    this.scheduleService.runTaskOnce(jobName);
    return HttpErrorByCode[200];
  }
}
