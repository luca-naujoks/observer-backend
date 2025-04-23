import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import * as fs from 'fs';
import { IBackendConfig } from './OutputInterfaces';

const configDir = 'configuration';

function createConfigFileSync() {
  const configFile = `${configDir}/appConfig.json`;
  const defaultConfig: IBackendConfig = {
    TmdbApiKey: '',
    AnimeDir: '',
    SeriesDir: '',
    PageSize: 100,
  };

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  if (!fs.existsSync(configFile)) {
    fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
  }
}

async function bootstrap() {
  createConfigFileSync();

  const app = await NestFactory.create(AppModule, { cors: true });

  const config = new DocumentBuilder()
    .setTitle('AniStream API')
    .setDescription(
      'The AniStream API is a universal backend for media servers',
    )
    .setVersion('1.2')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  console.error('Error during bootstrap:', error);
});
