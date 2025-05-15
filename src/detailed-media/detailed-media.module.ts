import { Module } from '@nestjs/common';
import { DetailedMediaService } from './detailed-media.service';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { modules } from 'src/shared/typeOrmImports';

@Module({
  imports: [TypeOrmModule.forFeature(modules)],
  providers: [DetailedMediaService, SqliteService],
})
export class DetailedMediaModule {}
