import { Injectable } from '@nestjs/common';
import { IBackendConfig } from './shared/OutputInterfaces';
import * as fs from 'fs';

@Injectable()
export class AppService {
  static getConfig() {
    const config: IBackendConfig = JSON.parse(
      fs.readFileSync('storage/appConfig.json', 'utf8'),
    ) as IBackendConfig;
    return Promise.resolve(config);
  }

  static configure(config: IBackendConfig) {
    // validate and check the storage

    fs.writeFileSync(
      'storage/appConfig.json',
      JSON.stringify(config, null, 2),
    );
  }
}
