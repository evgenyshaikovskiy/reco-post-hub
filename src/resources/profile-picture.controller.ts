import {
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResourceService } from './resource.service';
import { AuthInterceptor } from 'src/auth.interceptor';
import { diskStorage } from 'multer';

@UseInterceptors(AuthInterceptor)
@Controller('upload-profile-picture')
export class ProfilePictureController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
      }),
    }),
  )
  public async uploadProfilePicture(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/png' })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return file.filename;
  }
}
