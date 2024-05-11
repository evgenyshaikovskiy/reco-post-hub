import { IsArray, IsNumber, IsString } from 'class-validator';

export abstract class CreateCommentDto {
  @IsString()
  authorId: string;
  @IsString()
  topicId: string;
  @IsString()
  textContent: string;
  @IsString()
  htmlContent: string;
  @IsArray()
  mentionedProfileIds: string[];
}

export abstract class CreateAnswerDto {
  @IsNumber()
  authorId: string;
  @IsString()
  topicId: string;
  @IsString()
  textContent: string;
  @IsString()
  htmlContent: string;
  @IsArray()
  mentionedProfileIds: string[];
  @IsString()
  parentCommentId: string;
}
