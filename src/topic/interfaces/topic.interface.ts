export interface ITopic {
  topicId: string;
  authorId: number;
  url: string;
  title: string;
  textContent: string;
  htmlContent: string;
  hashtags: string[];
  summarization: string;
}