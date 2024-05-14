import { IHashtag } from 'src/hashtag/interfaces';
import { IScore } from 'src/score/score.interface';
import { IUser } from 'src/users/interfaces/user.interface';

export interface ITopic {
  topicId: string;
  author: IUser;
  url: string;
  title: string;
  textContent: string;
  htmlContent: string;
  hashtags: IHashtag[];
  scores: IScore[];
  summarization: string;
}
