import { Module } from '@nestjs/common';
import { RandomService } from './random.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalSeason } from 'src/enities/localSeasons.entity';
import { Media } from 'src/enities/media.entity';
import { Tag } from 'src/enities/tags.entity';
import { Trending } from 'src/enities/trending.entity';
import { SqliteService } from 'src/sqlite/sqlite.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media, LocalSeason, Tag, Trending])],
  providers: [RandomService, SqliteService],
})
export class RandomModule {}
