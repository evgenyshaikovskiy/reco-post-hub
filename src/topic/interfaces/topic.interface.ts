import { IBookmark } from 'src/bookmark/bookmark.interface';
import { IComment } from 'src/comment/interfaces';
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
  relatedBookmarks: IBookmark[];
  comments: IComment[];
  summarization: string;
  published: boolean;
  totalScore: number;
}
