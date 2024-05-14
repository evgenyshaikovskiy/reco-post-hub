import { IsNumber, IsString } from 'class-validator';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IUser } from 'src/users/interfaces/user.interface';

export interface IScore {
  id: string;
  actor: IUser;
  score: number;
  topic: ITopic;
}

export abstract class CreateScoreDto {
  @IsNumber()
  score: number;

  topicId: string;
}

export abstract class UpdateScoreDto {
  @IsNumber()
  score: number;

  id: string;
}
