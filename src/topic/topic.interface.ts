import { HashtagEntity } from 'src/hashtag/hashtag.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { IPublicUser } from 'src/users/user.interface';

export interface IPublicTopic {
  topicId: string;

  authorId: number;

  url: string;

  title: string;

  textContent: string;

  htmlContent: string;

  hashtags: HashtagEntity[];

  summarization: string;

  createdAt: Date;

  updatedAt: Date;

  user: IPublicUser;
}
