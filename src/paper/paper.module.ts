import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaperEntity } from './paper.entity';
import { PaperService } from './paper.service';
import { PaperController } from './paper.controller';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { PaperPublicController } from './public-paper.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaperEntity]), JwtModule, UsersModule],
  providers: [PaperService],
  exports: [PaperService],
  controllers: [PaperController, PaperPublicController],
})
export class PaperModule {}
