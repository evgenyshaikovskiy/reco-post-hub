export interface IComment {
  id: string;
  authorId: string;
  topicId: string;
  textContent: string;
  htmlContent: string;
  mentionedProfileIds: string[];
}