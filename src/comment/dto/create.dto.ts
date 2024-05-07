import { IsArray, IsNumber, IsString } from 'class-validator';

export abstract class CreateCommentDto {
  @IsNumber()
  authorId: number;
  @IsString()
  topicId: string;
  @IsString()
  textContent: string;
  @IsString()
  htmlContent: string;
  @IsArray()
  mentionedProfileIds: number[];
}

export abstract class CreateAnswerDto {
  @IsNumber()
  authorId: number;
  @IsString()
  topicId: string;
  @IsString()
  textContent: string;
  @IsString()
  htmlContent: string;
  @IsArray()
  mentionedProfileIds: number[];
  @IsString()
  parentCommentId: string;
}
