import { Injectable } from '@nestjs/common';
import { MongoURIValidator } from 'src/utils/mongo-uri.validator';
import { RabbitMQValidator } from 'src/utils/rabbitmq.validator';
import { TmdbApiValidator } from 'src/utils/tmdb-uri.validator';

@Injectable()
export class SetupService {
  async checkMongoDB(mongodbURI: string): Promise<boolean> {
    return MongoURIValidator.isValidMongoDBURI(mongodbURI);
  }

  async checkRabbitMQ(rabbitmqURI: string): Promise<boolean> {
    return RabbitMQValidator.isValidRabbitMQConnection(rabbitmqURI);
  }

  async checkTmdbAPIKey(api_key: string): Promise<boolean> {
    return TmdbApiValidator.isValidTmdbAPIKey(api_key);
  }
}
