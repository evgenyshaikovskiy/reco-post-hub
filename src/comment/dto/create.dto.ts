import { IsArray, IsNumber, IsString } from 'class-validator';

export abstract class CreateCommentDto {
  @IsString()
  topicId: string;
  @IsString()
  textContent: string;
  @IsString()
  htmlContent: string;
}

export abstract class CreateAnswerDto {
  @IsString()
  topicId: string;
  @IsString()
  textContent: string;
  @IsString()
  htmlContent: string;
  @IsString()
  parentCommentId: string;
}
