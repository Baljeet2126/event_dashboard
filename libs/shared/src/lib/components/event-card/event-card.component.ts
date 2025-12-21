// libs/shared/src/lib/components/event-card/event-card.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  Signal,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  CATEGORY_LABELS,
  CulturalEvent,
  STATUS_LABELS,
  formatDate,
} from '@shared';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  // ----- inputs -----
  cultureEvent = input.required<CulturalEvent>();
 isFavorite = input<boolean>(false); 

  // ----- outputs -----
  onEdit = output<CulturalEvent>();
  onDelete = output<CulturalEvent>();
  onToggleStatus = output<CulturalEvent>();
  toggleFavorite = output<string>();

  // ----- helpers -----
  getCategoryLabel(category: CulturalEvent['category']): string {
    return CATEGORY_LABELS[category];
  }

  getStatusLabel(status: CulturalEvent['status']): string {
    return STATUS_LABELS[status];
  }

  formattedDate(date: Date): string {
    return formatDate(date);
  }

  // ----- UI events -----
  onFavoriteClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit(this.cultureEvent().id);
  }
}
