import { Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQValidator {
  static async isValidRabbitMQConnection(url: string): Promise<boolean> {
    try {
      const connection = await amqplib.connect(url);
      await connection.close();
      return true;
    } catch (error) {
      console.error('The RabbitMQ connection is invalid:', error.message);
      return false;
    }
  }
}