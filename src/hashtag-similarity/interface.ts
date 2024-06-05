import { HashtagEntity } from "src/hashtag/hashtag.entity";
import { IHashtag } from "src/hashtag/interfaces";

export interface IHashtagSimilarity {
  id: string;
  hashtag: HashtagEntity;
  otherHashtags: string[];
}