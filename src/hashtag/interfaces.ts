import { ITopic } from "src/topic/interfaces/topic.interface";

export interface IHashtag {
  id: string;
  name: string;
  topics: ITopic[];
}