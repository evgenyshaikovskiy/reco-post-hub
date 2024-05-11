import { IHashtag } from 'src/hashtag/interfaces';
import { IUser } from 'src/users/interfaces/user.interface';

export interface ITopic {
  topicId: string;
  author: IUser;
  url: string;
  title: string;
  textContent: string;
  htmlContent: string;
  hashtags: IHashtag[];
  summarization: string;
}
