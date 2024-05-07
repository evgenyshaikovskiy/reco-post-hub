import { IsArray, IsString } from "class-validator";

export abstract class EditCommentDto {
  @IsString()
  id: string;

  @IsString()
  textContent: string;

  @IsString()
  htmlContent: string;

  @IsArray()
  mentionedProfileIds: number[];
}