import { IsArray, IsString } from "class-validator";

export abstract class CreatePaperDto {
  @IsString()
  title: string;

  @IsString()
  contentHtml: string;

  @IsString()
  contentText: string;

  @IsString()
  summarization: string;

  @IsArray()
  hashtags: string[];
}
