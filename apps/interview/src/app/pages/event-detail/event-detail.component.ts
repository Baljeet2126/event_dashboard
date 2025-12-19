import { CommonModule } from '@angular/common';
import {
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CATEGORY_LABELS, CulturalEvent } from '../../models/event.model';
import { EventStore } from '../../store/event.store';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: CulturalEvent | null = null;
  error: string | null = null;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null = null;

  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private destroyRef = inject(DestroyRef);
  private store = inject(EventStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ngZone = inject(NgZone);

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (!id) return;

  this.store.selectEvent(id);

  this.store.selectedEvent$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (event) => {
        this.event = event ?? null;

        if (this.event) {
          this.startCountdown();
        }
      },
      error: (err) => {
        this.error = err.message;
      },
    });
}

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.store.selectEvent(null);
  }

  getCategoryLabel(category: CulturalEvent['category']): string {
    return CATEGORY_LABELS[category];
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  }

  deleteEvent(): void {
    if (
      this.event &&
      confirm(`Are you sure you want to delete "${this.event.title}"?`)
    ) {
      this.store.deleteEvent(this.event.id).subscribe({
        next: () => this.router.navigate(['/']),
      });
    }
  }

  private startCountdown(): void {
    if (!this.event) return;
    if (this.countdownInterval) {
    clearInterval(this.countdownInterval);
    this.countdownInterval = null;
  }
    this.ngZone.runOutsideAngular(() => {
      this.countdownInterval = setInterval(() => {
        this.updateCountdown();
         console.log('Countdown:', this.countdown);
      }, 1000);
    });

    this.updateCountdown();
  }

  private updateCountdown(): void {
    if (!this.event) return;

    const diff = new Date(this.event.date).getTime() - Date.now();

    if (diff <= 0) {
      this.countdown = null;
      this.clearCountdown();
      return;
    }

    this.countdown = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  private clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}
