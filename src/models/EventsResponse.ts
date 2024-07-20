import { DetailedEvent } from './DetailedEvent';
export interface EventsResponse {
  events: DetailedEvent[];
  totalCount: number;
  pageSize: number;
  numberOfPages: number;
  page: number;
}


