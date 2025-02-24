import { ApiProperty } from '@nestjs/swagger';
import { Iconfig } from './interfaces';

export class ConfigDto implements Iconfig {
  @ApiProperty({
    description: 'The configuration State of the Backend',
    example: true,
  })
  CONFIGURED: boolean;

  @ApiProperty({
    description: 'The URI to the MongoDB Database',
    example: 'mongodb://localhost:27017',
  })
  MONGO_URI: string;

  @ApiProperty({
    description: 'The URI to the RabbitMQ Database',
    example: 'amqp://localhost:5672',
  })
  RABBITMQ_URI: string;

  @ApiProperty({
    description: 'The Queue name that should be used',
    example: 'anisquid',
  })
  RABBITMQ_QUEUE: string;

  @ApiProperty({
    description: 'The API Key for the TMDB API',
    example: '1234567890',
  })
  TMDB_API_KEY: string;

  @ApiProperty({
    description: 'The path to the local Anime Directory',
    example: '/anime',
  })
  LOCAL_ANIME_PATH: string;

  @ApiProperty({
    description: 'The path to the local Series Directory',
    example: '/series',
  })
  LOCAL_SERIES_PATH: string;
}
