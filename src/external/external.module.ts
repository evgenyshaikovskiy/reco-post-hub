import { Module } from '@nestjs/common';
import { HuggingFaceController } from './hugging-face.controller';

@Module({
  imports: [],
  controllers: [HuggingFaceController],
})
export class ExternalModule {}
