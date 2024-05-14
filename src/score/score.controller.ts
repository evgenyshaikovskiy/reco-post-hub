import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthInterceptor } from 'src/auth.interceptor';
import { ScoreService } from './score.service';
import { CreateScoreDto, UpdateScoreDto } from './score.interface';
import { GetUser } from 'src/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@UseInterceptors(AuthInterceptor)
@Controller('score')
export class ScoreController {
  constructor(private readonly service: ScoreService) {}

  @Post()
  public async createScore(
    @Body() dto: CreateScoreDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.service.create(dto, user);
  }

  @Delete(':id')
  public async removeScore(@Param() params, @GetUser() user: UserEntity) {
    return await this.service.delete(params.id, user);
  }

  @Patch()
  public async updateScore(
    @Body() dto: UpdateScoreDto,
    @GetUser() user: UserEntity,
  ) {
    return await this.service.update(dto, user);
  }
}
