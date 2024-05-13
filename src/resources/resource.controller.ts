import {
  Controller,
  Get,
  Param,
  Response,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get(':filename')
  public async getFile(@Param() params, @Response({ passthrough: true }) res) {
    res.set({
      'Content-Type': 'image/png',
    });
    const readStream = this.resourceService.getFile(params.filename);
    return new StreamableFile(readStream);
  }
}
