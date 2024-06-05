export enum EventType {
  // between user and topic
  VIEW_TOPIC = 'view-topic',
  VIEW_TOPIC_UNAUTHORIZED = 'view-topic-unauthorized',
  // between user and user
  SUBSCRIBE_TO_USER = 'subscribe-to-user',
  UNSUBSCRIBE_FROM_USER = 'unsubsribe-from-user',
  // between user and hashtag
  SUBSCRIBE_TO_HASHTAG = 'subscribe-to-hashtag',
  UNSUBSCRIBE_FROM_HASHTAG = 'unsubscribe-from-hashtag',
  // between user and topic
  TOPIC_PUBLISHED = 'topic-published',
  // between mod and topic
  TOPIC_APPROVED = 'topic-approved',
  // user and score
  ADD_SCORE = 'score-added',
  REMOVE_SCORE = 'score-removed',
  UPDATE_SCORE = 'update-score',
}

export interface IEvent {
  id: string;
  emitterId: string;
  receiverId: string;
  type: EventType;
  createdAt: Date;
  updatedAt: Date;
}
