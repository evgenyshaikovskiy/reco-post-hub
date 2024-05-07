export interface IComment {
  id: string;
  authorId: number;
  topicId: string;
  textContent: string;
  htmlContent: string;
  mentionedProfileIds: number[];
}