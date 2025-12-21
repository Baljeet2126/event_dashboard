// libs/shared/src/lib/models/event-model.ts
export interface CulturalEvent {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  category: EventCategory;
  venue: string;
  date: Date;
  ticketPrice: number;
  availableSeats: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EventStatus = 'draft' | 'published' | 'cancelled';
export type EventCategory = 'concert' | 'opera' | 'theater' | 'exhibition';

export interface EventFilters {
  status: EventStatus | 'all';
  category: EventCategory | 'all';
  searchTerm: string;
}

export const DEFAULT_FILTERS: EventFilters = {
  status: 'all',
  category: 'all',
  searchTerm: '',
};

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  concert: 'Concert',
  opera: 'Opera',
  theater: 'Theater',
  exhibition: 'Exhibition',
};

export const STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  cancelled: 'Cancelled',
};
