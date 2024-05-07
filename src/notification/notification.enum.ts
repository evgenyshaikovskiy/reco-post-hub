export enum NotificationType {
  // when user is mentioned under some topic
  MENTION = 'mention',
  // when other user commented under other user topic
  COMMENT = 'comment',
  // when user resetted own's password
  PASSWORD_RESET = 'password_reset',
  // when other user subscribed to user topics
  SUBSCRIBED = 'subscribed',
  // when user created account
  CREATED = 'created',
}