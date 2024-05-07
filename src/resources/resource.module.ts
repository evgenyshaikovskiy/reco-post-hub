import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';
import { ResourceService } from './resource.service';
import { ProfilePictureController } from './profile-picture.controller';
import { ResourceController } from './resource.controller';
import { diskStorage } from 'multer';



@Module({
  imports: [
    JwtModule,
    UsersModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [ResourceService],
  controllers: [ProfilePictureController, ResourceController],
  exports: [ResourceService],
})
export class ResourceModule {}
