import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import {
  CulturalEvent,
  DEFAULT_FILTERS,
  EventFilters,
  EventApiService
} from '@shared';


/**
 * Event Store
 * Manages application state for cultural events.
 */

interface EventState {
  events: CulturalEvent[];
  filters: EventFilters;
  selectedEventId: string | null;
  loading: boolean;
  error: string | null;

}

const initialState: EventState = {
  events: [],
  filters: DEFAULT_FILTERS,
  selectedEventId: null,
  loading: false,
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class EventStore {
  private state$ = new BehaviorSubject<EventState>(initialState);

  // Selectors
  readonly events$ = this.state$.pipe(map((state) => state.events));
  readonly filters$ = this.state$.pipe(map((state) => state.filters));
  readonly loading$ = this.state$.pipe(map((state) => state.loading));
  readonly error$ = this.state$.pipe(map((state) => state.error));

  readonly selectedEvent$ = this.state$.pipe(
  map(state => {
    if (!state.selectedEventId) {
      return null;
    }

    return state.events.find(
      e => e.id === state.selectedEventId
    ) ?? null;
  })
);


  readonly filteredEvents$ = combineLatest([this.events$, this.filters$]).pipe(
    map(([events, filters]) =>
      this.sortByDate(this.applyFilters(events, filters)))
  );

  readonly eventCounts$ = this.events$.pipe(
    map((events) => ({
      total: events.length,
      published: events.filter((e) => e.status === 'published').length,
      draft: events.filter((e) => e.status === 'draft').length,
      cancelled: events.filter((e) => e.status === 'cancelled').length,
    }))
  );

  constructor(private api: EventApiService) {}

  // Actions
  loadEvents(): void {
    this.patchState({ loading: true, error: null });

    this.api.getAll().subscribe({
      next: (events) => {
        this.patchState({ events, loading: false });
      },
      error: (err) => {
        this.patchState({ loading: false, error: err.message });
      },
    });
  }

  selectEvent(id: string | null): void {
    this.patchState({ selectedEventId: id });
  }

  updateFilters(filters: Partial<EventFilters>): void {
    const currentFilters = this.state$.getValue().filters;
    this.patchState({
      filters: { ...currentFilters, ...filters },
    });
  }

  resetFilters(): void {
    this.patchState({ filters: DEFAULT_FILTERS });
  }

  createEvent(
    event: Omit<CulturalEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<CulturalEvent> {
    this.patchState({ loading: true });

    return new Observable((subscriber) => {
      this.api.create(event).subscribe({
        next: (newEvent) => {
          const currentEvents = this.state$.getValue().events;
          this.patchState({
            events: [...currentEvents, newEvent],
            loading: false,
          });
          subscriber.next(newEvent);
          subscriber.complete();
        },
        error: (err) => {
          this.patchState({ loading: false, error: err.message });
          subscriber.error(err);
        },
      });
    });
  }

  updateEvent(
    id: string,
    updates: Partial<CulturalEvent>
  ): Observable<CulturalEvent> {
    this.patchState({ loading: true });

    return new Observable((subscriber) => {
      this.api.update(id, updates).subscribe({
        next: (updatedEvent) => {
          const currentEvents = this.state$.getValue().events;
          const index = currentEvents.findIndex((e) => e.id === id);
          if (index !== -1) {
            const newEvents = [...currentEvents];
            newEvents[index] = updatedEvent;
            this.patchState({ events: newEvents, loading: false });
          }
          subscriber.next(updatedEvent);
          subscriber.complete();
        },
        error: (err) => {
          this.patchState({ loading: false, error: err.message });
          subscriber.error(err);
        },
      });
    });
  }

  deleteEvent(id: string): Observable<void> {
    this.patchState({ loading: true });

    return new Observable((subscriber) => {
      this.api.delete(id).subscribe({
        next: () => {
          const currentEvents = this.state$.getValue().events;
          this.patchState({
            events: currentEvents.filter((e) => e.id !== id),
            loading: false,
            selectedEventId:
              this.state$.getValue().selectedEventId === id
                ? null
                : this.state$.getValue().selectedEventId,
          });
          subscriber.next();
          subscriber.complete();
        },
        error: (err) => {
          this.patchState({ loading: false, error: err.message });
          subscriber.error(err);
        },
      });
    });
  }

  toggleEventStatus(id: string): void {
    const event = this.state$.getValue().events.find((e) => e.id === id);
    if (!event) return;

    const newStatus = event.status === 'published' ? 'draft' : 'published';
    this.updateEvent(id, { status: newStatus }).subscribe();
  }

  private patchState(patch: Partial<EventState>): void {
    this.state$.next({ ...this.state$.getValue(), ...patch });
  }

  private applyFilters(
    events: CulturalEvent[],
    filters: EventFilters
  ): CulturalEvent[] {
    return events.filter((event) => {
      // Status filter
      if (filters.status !== 'all' && event.status !== filters.status) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }

      // Search filter
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(term);
        const matchesDescription = event.description
          .toLowerCase()
          .includes(term);
        const matchesVenue = event.venue.toLowerCase().includes(term);
        if (!matchesTitle && !matchesDescription && !matchesVenue) {
          return false;
        }
      }

      return true;
    });
  }

  private sortByDate(events: CulturalEvent[]): CulturalEvent[] {
  const now = new Date().getTime();

  return [...events].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();

    const aUpcoming = aTime >= now;
    const bUpcoming = bTime >= now;

    // Upcoming events first
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    // Then sort by nearest date
    return aTime - bTime;
  });
}

}


