import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { AppService } from 'src/app.service';
import { IBackendConfig } from 'src/OutputInterfaces';
import { ConfigDto } from 'src/swagger.dto';
import { SetupService } from './setup.service';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {}

  @ApiOperation({ summary: 'Returns the current configuration of the Backend' })
  @Get()
  async getConfig() {
    const config: IBackendConfig = await AppService.getConfig();

    if (config.TmdbApiKey) {
      config.TmdbApiKey = '********';
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
  @Post()
  configureBackend(@Body() config: IBackendConfig) {
    return AppService.configure(config);
  }
}
