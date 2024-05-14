import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { EventService } from './event.service';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([EventEntity]), JwtModule],
  providers: [EventService],
  exports: [EventService],
  controllers: [],
})
export class EventModule {}
