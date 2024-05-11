import { EventType } from './interfaces';

export abstract class CreateEventDto {
  type: EventType;
  receiverId: string;
  emitterId: string;
}
