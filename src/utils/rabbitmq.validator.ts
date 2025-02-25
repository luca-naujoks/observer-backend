import { Injectable } from '@nestjs/common';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQValidator {
  static async isValidRabbitMQConnection(url: string): Promise<boolean> {
    try {
      const connection: amqplib.Connection = await amqplib.connect(url);
      await connection.close();
      return true;
    } catch (error: any) {
      console.error(
        'The RabbitMQ connection is invalid:',
        (error as Error).message,
      );
      return false;
    }
  }
}
