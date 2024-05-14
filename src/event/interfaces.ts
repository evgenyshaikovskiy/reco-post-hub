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
}

export interface IEvent {
  id: string;
  emitterId: string;
  receiverId: string;
  type: EventType;
  createdAt: Date;
  updatedAt: Date;
}