import { IsString } from 'class-validator';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IUser } from 'src/users/interfaces/user.interface';

export interface IBookmark {
  id: string;
  user: IUser;
  topic: ITopic;
}

export abstract class CreateBookmarkDto {
  @IsString()
  topicId: string;
}
