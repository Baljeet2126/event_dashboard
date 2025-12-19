import { CommonModule } from '@angular/common';
import {
  Component,
  ChangeDetectionStrategy,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  CATEGORY_LABELS,
  EventCategory,
  EventFilters,
  EventStatus,
  STATUS_LABELS,
} from '../../models/event.model';

interface FilterOption<T> {
  value: T;
  label: string;
}

@Component({
  selector: 'app-event-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFilterComponent {
  /* ================= Inputs / Outputs ================= */

  readonly filters = input.required<EventFilters>();
  readonly filtersChange = output<Partial<EventFilters>>();
  readonly reset = output<void>();

  /* ================= Local UI State ================= */

  readonly search = signal('');

  /* ================= Options ================= */

  readonly statusOptions: FilterOption<EventStatus>[] = [
    { value: 'draft', label: STATUS_LABELS.draft },
    { value: 'published', label: STATUS_LABELS.published },
    { value: 'cancelled', label: STATUS_LABELS.cancelled },
  ];

  readonly categoryOptions: FilterOption<EventCategory>[] = [
    { value: 'concert', label: CATEGORY_LABELS.concert },
    { value: 'opera', label: CATEGORY_LABELS.opera },
    { value: 'theater', label: CATEGORY_LABELS.theater },
    { value: 'exhibition', label: CATEGORY_LABELS.exhibition },
  ];

  /* ================= Computed (View Model) ================= */

  readonly hasActiveFilters = computed(() => {
    const f = this.filters();
    return f.status !== 'all' || f.category !== 'all' || !!f.searchTerm;
  });

  readonly activeStatus = computed<EventStatus | null>(() => {
    const status = this.filters().status;
    return status === 'all' ? null : status;
  });

  readonly activeCategory = computed<EventCategory | null>(() => {
    const category = this.filters().category;
    return category === 'all' ? null : category;
  });

  readonly activeSearch = computed(() => this.filters().searchTerm);

  /* ================= Effects ================= */

  constructor() {
    // 🔥 Debounced search → emit filter change
    effect(() => {
      const term = this.search().trim();

      // prevent unnecessary re-emits
      if (term === this.filters().searchTerm) return;

      const timeout = setTimeout(() => {
        this.filtersChange.emit({ searchTerm: term });
      }, 300);

      return () => clearTimeout(timeout);
    });
  }

  /* ================= Labels ================= */

  getStatusLabel(status: EventStatus): string {
    return STATUS_LABELS[status];
  }

  getCategoryLabel(category: EventCategory): string {
    return CATEGORY_LABELS[category];
  }

  /* ================= Handlers ================= */

  onSearchChange(term: string): void {
    this.search.set(term);
  }

  onStatusChange(status: EventStatus | 'all'): void {
    this.filtersChange.emit({ status });
  }

  onCategoryChange(category: EventCategory | 'all'): void {
    this.filtersChange.emit({ category });
  }

  clearStatus(): void {
    this.filtersChange.emit({ status: 'all' });
  }

  clearCategory(): void {
    this.filtersChange.emit({ category: 'all' });
  }

  clearSearch(): void {
    this.search.set('');
    this.filtersChange.emit({ searchTerm: '' });
  }

  clearAll(): void {
     this.search.set('');          
     this.reset.emit();
  }
}
