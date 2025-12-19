import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { EventCardComponent } from '../../components/event-card/event-card.component';
import { EventFilterComponent } from '../../components/event-filter/event-filter.component';
import { EventStore } from '../../store/event.store';
import { CulturalEvent, EventFilters } from '../../models/event.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCardComponent, EventFilterComponent],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {
  private store = inject(EventStore);
  private router = inject(Router);

  // Base signals from store
  readonly filteredEvents = toSignal(this.store.filteredEvents$, {
    initialValue: [],
  });

  readonly filters = toSignal(this.store.filters$, {
    initialValue: { status: 'all', category: 'all', searchTerm: '' },
  });

  readonly eventCounts = toSignal(this.store.eventCounts$, {
    initialValue: null,
  });

  readonly loading = toSignal(this.store.loading$, { initialValue: false });
  readonly error = toSignal(this.store.error$, { initialValue: null });

  // Computed signals (VIEW MODEL)
  readonly hasStats = computed(
    () => !!this.eventCounts() && this.eventCounts()!.total > 0
  );

  readonly hasEvents = computed(
    () => this.filteredEvents().length > 0
  );

  readonly isEmpty = computed(
    () =>
      !this.loading() &&
      !this.error() &&
      this.filteredEvents().length === 0
  );

  readonly showGrid = computed(
    () =>
      !this.loading() &&
      !this.error() &&
      this.filteredEvents().length > 0
  );

  constructor() {
    this.loadEvents();
  }

  loadEvents(): void {
    this.store.loadEvents();
  }

  // Actions
  onFiltersChange(filters: Partial<EventFilters>): void {
    this.store.updateFilters(filters);
  }

  onResetFilters(): void {
    this.store.resetFilters();
  }

  editEvent(event: CulturalEvent): void {
    this.router.navigate(['/events', event.id, 'edit']);
  }

  deleteEvent(event: CulturalEvent): void {
    if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
      this.store.deleteEvent(event.id).subscribe();
    }
  }

  toggleStatus(event: CulturalEvent): void {
    this.store.toggleEventStatus(event.id);
  }

  createEvent(): void {
    this.router.navigate(['/events/new']);
  }
}
