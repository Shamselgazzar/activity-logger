import { Event, User, EventAction } from '@prisma/client';

export interface DetailedEvent extends Event {
  actor: User;
  action: EventAction;
  target: User;
}