import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IBookmark } from './bookmark.interface';
import { ITopic } from 'src/topic/interfaces/topic.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { TopicEntity } from 'src/topic/topic.entity';

@Entity()
export class BookmarkEntity implements IBookmark {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.bookmarks, {
    createForeignKeyConstraints: false,
  })
  user: IUser;

  @ManyToOne(() => TopicEntity, (topic) => topic.relatedBookmarks, {
    createForeignKeyConstraints: false,
  })
  topic: ITopic;
}
