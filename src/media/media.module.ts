import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SqliteService } from 'src/sqlite/sqlite.service';
import { modules } from 'src/shared/typeOrmImports';

@Module({
  imports: [TypeOrmModule.forFeature(modules)],
  providers: [MediaService, SqliteService],
})
export class MediaModule {}
