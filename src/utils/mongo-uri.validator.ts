import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';

@Injectable()
export class MongoURIValidator {
  static async isValidMongoDBURI(uri: string): Promise<boolean> {
    try {
      await mongoose.connect(uri);
      return true;
    } catch (error: any) {
      console.error('The MongoDB URI is invalid:', (error as Error).message);
      return false;
    }
  }
}
