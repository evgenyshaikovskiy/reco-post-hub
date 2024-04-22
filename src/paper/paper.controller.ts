import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { PaperService } from './paper.service';
import { CreatePaperDto } from './dtos';
// import { AuthGuard } from '@nestjs/passport';
// import { GetUser } from 'src/auth/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthInterceptor } from 'src/auth.interceptor';
import { GetUser } from 'src/user.decorator';
// import { AuthGuard } from 'src/auth.guard';

// @UseGuards(AuthGuard('jwt'))
@UseInterceptors(AuthInterceptor)
@Controller('paper')
export class PaperController {
  constructor(private readonly paperService: PaperService) {}

  @Post()
  public async createPaper(
    @Body() dto: CreatePaperDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.paperService.create(dto, user);
  }
}
