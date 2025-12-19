import { CommonModule } from '@angular/common';
import { Component,
  ChangeDetectionStrategy, 
  input,
   output,
   signal,
   inject
   } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CATEGORY_LABELS,
  CulturalEvent,
  STATUS_LABELS,
} from '../../models/event.model';
import { EventStore } from '../../store/event.store';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
    private store = inject(EventStore);
  cultureEvent = input.required<CulturalEvent>();
   onEdit = output<CulturalEvent>();
   onDelete = output<CulturalEvent>();
   onToggleStatus = output<CulturalEvent>();

  private favorites = signal<Set<string>>(new Set());


  getCategoryLabel(category: CulturalEvent['category']): string {
    return CATEGORY_LABELS[category];
  }

  getStatusLabel(status: CulturalEvent['status']): string {
    return STATUS_LABELS[status];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  isFavorite(id: string): boolean {
    return this.store.isFavorite(id);
  }

  toggleFavorite(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.store.toggleFavorite(id);
  }
}
