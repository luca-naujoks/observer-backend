import { Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CronTime } from 'cron';
import { SchedulesService } from './schedules.service';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Controller('schedules')
export class SchedulesController {
  private readonly sqliteService: SqliteService;

  constructor(private readonly scheduleService: SchedulesService) {}

  @ApiOperation({
    summary: 'Get a scheduled task',
  })
  @ApiQuery({
    name: 'taskName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to',
  })
  @Get('task')
  getTask(@Query('taskName') taskName: string) {
    return this.scheduleService.getTask(taskName);
  }

  @ApiOperation({
    summary: 'List all scheduled tasks',
  })
  @Get()
  listScheduledTasks() {
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
    name: 'taskName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to add',
  })
  @Post()
  addScheduledTask(
    @Query('time') time: string,
    @Query('taskName') taskName: string,
  ) {
    const task = () => {
      return;
    };

    this.scheduleService.addTask({
      taskName: taskName,
      task: task,
      schedule: time,
    });

    return { statusCode: 201, message: 'Task added successfully' };
  }

  @ApiOperation({
    summary: 'Edit the schedule of a cron job',
  })
  @ApiQuery({
    name: 'taskName',
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
  editScheduledTask(
    @Query('time') time: string,
    @Query('taskName') taskName: string,
  ) {
    const cronTime = new CronTime(time);
    this.scheduleService.updateTask(taskName, cronTime);
    return { statusCode: 200, message: 'Task updated successfully' };
  }

  @ApiOperation({
    summary: 'Remove a scheduled task',
  })
  @ApiQuery({
    name: 'taskName',
    type: String,
    example: 'default-local-scanner',
    description: 'The name of the job to remove',
  })
  @Delete()
  removeScheduledTask(@Query('taskName') taskName: string) {
    this.scheduleService.removeTask(taskName);
    return { statusCode: 204, message: 'Task removed successfully' };
  }

  @Post('run-task-now')
  async runTaskOnce(@Query('taskName') taskName: string) {
    await this.scheduleService.runTaskOnce(taskName);
    return { statusCode: 200, message: 'Task executed successfully' };
  }
}
