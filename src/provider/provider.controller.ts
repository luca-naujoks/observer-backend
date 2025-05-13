import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ProviderRegistry } from './provider.regirsty';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Providers')
@Controller('provider')
export class ProviderController {
  constructor() {}

  @Get()
  getProviders() {
    return ProviderRegistry.listProviders();
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  getProvider(@Param() params: { id: string }) {
    return ProviderRegistry.getProvider(params.id);
  }

  @Post()
  uploadProvider() {}

  @Delete()
  removeProvider(@Query('id') id: string) {
    return ProviderRegistry.removeProvider(id);
  }
}
