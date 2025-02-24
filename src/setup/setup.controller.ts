import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ApiBody, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppService } from 'src/app.service';
import { Iconfig } from 'src/interfaces';
import { ConfigDto } from 'src/swagger.dto';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @ApiOperation({summary: 'Returns the current configuration of the Backend'})
  @Get('config')
  async getConfig() {
    const config : Iconfig = await AppService.getConfig();

    if(!config.CONFIGURED){
      throw new HttpErrorByCode[500]();
    }

    if (config.TMDB_API_KEY) {
      config.TMDB_API_KEY = '********';
    }

    return config;

    
  }

  @ApiOperation({
    summary: 'Configures the Backend with the supplyed configuration object',
  })
  @ApiBody({
    type: ConfigDto,
    description: 'The configuration object for the backend',
  })
  @Post('configure')
  async configureBackend(@Body() config: Iconfig) {
    if ((await AppService.getConfig()).CONFIGURED) {
      return {
        error: 'Already Configured',
        message: 'Configuration already done',
      };
    }
    return AppService.configure(config);
  }

  @ApiOperation({
    summary:
      'Just returns a positive response so external Applications can identify this backend',
  })
  @Post('check-backendUrl')
  @HttpCode(204)
  async checkBackendURL() {
    return;
  }

  @ApiOperation({
    summary: 'Validates if the supplyed URL points to an MongoDB DB',
  })
  @ApiBody({
    type: String,
    examples: { example: { value: { payload: 'mongodb://localhost:27017' } } },
    description: 'The MongoDB URI',
  })
  @Post('check-mongodbURL')
  @HttpCode(204)
  async checkMongoDBURL(@Body('payload') mongodbURI: string) {
    const checkResult = await this.setupService.checkMongoDB(mongodbURI);
    if (checkResult) {
      return;
    } else {
      throw new HttpErrorByCode[500]();
    }
  }

  @ApiOperation({
    summary: 'Validates if the supplyed URL points to an RabbitMQ DB',
  })
  @ApiBody({
    type: String,
    examples: { example: { value: { payload: 'amqp://localhost:5672' } } },
    description: 'The RabbitMQ URI',
  })
  @Post('check-rabbitmqURL')
  @HttpCode(204)
  async checkRabbitMQURL(@Body('payload') rabbitmqURI: string) {
    const checkResult = await this.setupService.checkRabbitMQ(rabbitmqURI);
    if (checkResult) {
      return;
    } else {
      throw new HttpErrorByCode[500]();
    }
  }

  @ApiOperation({ summary: 'Validates the RabbitMQ Queue' })
  @ApiBody({
    type: String,
    examples: { example: { value: { payload: 'anisquid' } } },
    description: 'The RabbitMQ Queue Name',
  })
  @Post('check-rabbitmqQueue')
  @HttpCode(204)
  async checkRedisPassword(@Body('payload') queue: string) {}

  @ApiOperation({
    summary:
      'Validates the TMDB API Key to get informations about every series and anime',
  })
  @ApiBody({
    type: String,
    examples: { example: { value: { payload: '1234567890' } } },
    description: 'The TMDB API Key',
  })
  @Post('check-tmdbApiKey')
  @HttpCode(204)
  async checkTMDBApiKey(@Body('payload') api_key: string) {
    const checkResult = await this.setupService.checkTmdbAPIKey(api_key);
    if (checkResult) {
      return;
    } else {
      throw new HttpErrorByCode[500]();
    }
  }

  @ApiOperation({ summary: 'Validates the path of the series Directory' })
  @ApiBody({
    type: String,
    examples: { example: { value: { directory: '/animes' } } },
    description: 'The path to the local anime directory',
  })
  @Post('check-localAnimeDir')
  @HttpCode(204)
  async checkLocalAnimeDir(@Body('directory') dir: string) {
    return;
  }

  @ApiOperation({ summary: 'Validates the path of the series Directory' })
  @ApiBody({
    type: String,
    examples: { example: { value: { directory: '/series' } } },
    description: 'The path to the local series directory',
  })
  @Post('check-localSeriesDir')
  @HttpCode(204)
  async checkLocalSeriesDir(@Body('directory') dir: string) {
    return;
  }
}
