import { Controller, Get, Param, Post } from "@nestjs/common";
import { ResourceService } from "./resource.service";

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get(':filename')
  public async getFile(@Param() params) {
    return this.resourceService.getFile(params.filename);
  }
}