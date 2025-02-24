import { Module } from '@nestjs/common';
import { SetupService } from './setup.service';
import { SetupController } from './setup.controller';
import { AppService } from 'src/app.service';

@Module({
  imports: [],
  controllers: [SetupController],
  providers: [SetupService]
})
export class SetupModule {}
