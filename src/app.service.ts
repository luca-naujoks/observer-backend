import { Injectable } from '@nestjs/common';
import { Iconfig, IerrorObject } from './interfaces';
import * as fs from 'fs';

@Injectable()
export class AppService {
  static getConfig(): Promise<Iconfig> {
    const config: Iconfig = JSON.parse(
      fs.readFileSync('configuration/appConfig.json', 'utf8'),
    ) as Iconfig;
    return Promise.resolve(config);
  }

  static configure(config: Iconfig): Promise<Iconfig | IerrorObject> {
    // validate and check the configuration

    fs.writeFileSync(
      'configuration/appConfig.json',
      JSON.stringify(config, null, 2),
    );
    // return a error object with a success message and exit the process
    const successResponse: IerrorObject = {
      error: 'Success',
      message: 'Configuration successful',
    };

    setTimeout(() => {
      process.exit(0);
    }, 1000);

    return Promise.resolve(successResponse);
  }
}
