import { Controller, Get, Param } from '@nestjs/common';
import { PaperService } from './paper.service';

@Controller('paper')
export class PaperPublicController {
  constructor(private readonly paperService: PaperService) {}

  @Get(':url')
  public async getPaper(@Param() params) {
    return await this.paperService.getPaperByUrl(params.url);
  }
}
