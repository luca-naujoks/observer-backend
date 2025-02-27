import { Body, Controller, Get, Post } from '@nestjs/common';
import { SqliteService } from './sqlite.service';
import { MediaObjectDTO } from 'src/dtos/mediaObject.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('sqlite')
export class SqliteController {
  constructor(private readonly sqliteService: SqliteService) {}

  @Get()
  async getRandomMedia() {
    return await this.sqliteService.findRandomMedia('anime', 1);
  }

  @ApiBody({
    type: MediaObjectDTO,
  })
  @Post()
  async createMediaEntry(@Body() media: MediaObjectDTO) {
    return await this.sqliteService.createMedia(media);
  }
}

// {
//     id: 1,
//     type: 'anime',
//     tmdb_id: 76059,
//     stream_name: 'a-place-further-than-the-universe',
//     name: 'A Place Further Than the Universe',
//     poster:
//       'https://image.tmdb.org/t/p/original/iERXyBf0K6DfAQ8oKEYrdjf1vIs.jpg',
//     backdrop:
//       'https://image.tmdb.org/t/p/original/bTIbUZVoKnlMt2IrZQv2ODPVs0N.jpg',
//   }
