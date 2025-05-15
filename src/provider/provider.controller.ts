import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ProviderRegistry } from './provider.registry';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Providers')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerRegistry: ProviderRegistry) {}

  @Get()
  getProviders() {
    return this.providerRegistry.listProviders();
  }

  @ApiParam({ name: 'name', type: String })
  @Get(':name')
  getProvider(@Param() params: { name: string }) {
    return this.providerRegistry.getProvider(params.name);
  }

  @Post()
  uploadProvider() {}

  @ApiParam({ name: 'name', type: String })
  @Put(':name')
  toggleProvider(@Param() params: { name: string }) {
    return this.providerRegistry.toggleProvider(params.name);
  }

  @Delete()
  removeProvider(@Query('id') id: string) {
    return this.providerRegistry.removeProvider(id);
  }
}
