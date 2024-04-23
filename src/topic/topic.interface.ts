import { UserEntity } from "src/users/entities/user.entity";
import { IPublicUser } from "src/users/user.interface";

export class IPublicTopic {
  topicId: string;

  authorId: number;

  url: string;

  title: string;

  textContent: string;

  htmlContent: string;

  hashtags: string[] = [];

  summarization: string;

  createdAt: Date;

  updatedAt: Date = new Date();

  user: IPublicUser;
}
