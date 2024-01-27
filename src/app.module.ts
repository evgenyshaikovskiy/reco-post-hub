import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/config.schema';
import { config } from './config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroOrmConfig } from './config/mikro-orm.config';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
      load: [config],
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MikroOrmConfig,
      
    }),
    CommonModule,
    UsersModule,
    JwtModule,
  ],
  providers: [AppService],
})
export class AppModule {}
