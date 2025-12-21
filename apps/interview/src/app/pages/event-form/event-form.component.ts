import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CATEGORY_LABELS,
  CulturalEvent,
  EventCategory,
  EventStatus,
  STATUS_LABELS,
} from '@shared';
import { EventStore } from '../../store/event.store';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="event-form-page">
      <div class="event-form-page__header">
        <a routerLink="/" class="event-form-page__back">← Back to Events</a>
        <h1>{{ isEditMode ? 'Edit Event' : 'Create New Event' }}</h1>
      </div>

      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="event-form"
        *ngIf="!loading"
      >
        <div class="form-section">
          <h2>Basic Information</h2>

          <div class="form-group">
            <label for="title" class="form-label">Title *</label>
            <input
              id="title"
              type="text"
              formControlName="title"
              class="form-input"
              placeholder="Enter event title"
            />
            <div
              class="form-error"
              *ngIf="form.get('title')?.touched && form.get('title')?.errors"
            >
              Title is required
            </div>
          </div>

          <div class="form-group">
            <label for="description" class="form-label">Description *</label>
            <textarea
              id="description"
              formControlName="description"
              class="form-input form-textarea"
              rows="4"
              placeholder="Describe the event"
            ></textarea>
            <div
              class="form-error"
              *ngIf="
                form.get('description')?.touched &&
                form.get('description')?.errors
              "
            >
              Description is required
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="category" class="form-label">Category *</label>
              <select
                id="category"
                formControlName="category"
                class="form-select"
              >
                <option value="" disabled>Select a category</option>
                <option *ngFor="let cat of categories" [value]="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="status" class="form-label">Status *</label>
              <select id="status" formControlName="status" class="form-select">
                <option *ngFor="let stat of statuses" [value]="stat.value">
                  {{ stat.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Event Details</h2>

          <div class="form-group">
            <label for="venue" class="form-label">Venue *</label>
            <input
              id="venue"
              type="text"
              formControlName="venue"
              class="form-input"
              placeholder="Enter venue name"
            />
            <div
              class="form-error"
              *ngIf="form.get('venue')?.touched && form.get('venue')?.errors"
            >
              Venue is required
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="date" class="form-label">Date & Time *</label>
              <input
                id="date"
                type="datetime-local"
                formControlName="date"
                class="form-input"
              />
              <div
                class="form-error"
                *ngIf="form.get('date')?.touched && form.get('date')?.errors"
              >
                Date is required
              </div>
            </div>

            <div class="form-group">
              <label for="ticketPrice" class="form-label"
                >Ticket Price (€) *</label
              >
              <input
                id="ticketPrice"
                type="number"
                formControlName="ticketPrice"
                class="form-input"
                min="0"
                step="0.01"
              />
              <div
                class="form-error"
                *ngIf="
                  form.get('ticketPrice')?.touched &&
                  form.get('ticketPrice')?.errors
                "
              >
                Valid price is required
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="availableSeats" class="form-label"
                >Available Seats *</label
              >
              <input
                id="availableSeats"
                type="number"
                formControlName="availableSeats"
                class="form-input"
                min="0"
              />
              <div
                class="form-error"
                *ngIf="
                  form.get('availableSeats')?.touched &&
                  form.get('availableSeats')?.errors
                "
              >
                Number of seats is required
              </div>
            </div>

            <div class="form-group">
              <label for="imageUrl" class="form-label">Image URL</label>
              <input
                id="imageUrl"
                type="url"
                formControlName="imageUrl"
                class="form-input"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn--secondary" routerLink="/">
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn--primary"
            [disabled]="form.invalid || submitting"
          >
            {{
              submitting
                ? 'Saving...'
                : isEditMode
                ? 'Update Event'
                : 'Create Event'
            }}
          </button>
        </div>
      </form>

      <div class="loading" *ngIf="loading">
        <div class="loading__spinner"></div>
        <p>Loading event...</p>
      </div>
    </div>
  `,
  styles: `
    .event-form-page {
      max-width: 800px;
      margin: 0 auto;
      padding: var(--spacing-lg);
    }

    .event-form-page__header {
      margin-bottom: var(--spacing-xl);

      h1 {
        margin: var(--spacing-md) 0 0;
        font-size: 1.75rem;
      }
    }

    .event-form-page__back {
      color: var(--color-text-muted);
      text-decoration: none;

      &:hover {
        color: var(--color-primary);
      }
    }

    .event-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .form-section {
      background: var(--color-surface);
      padding: var(--spacing-lg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);

      h2 {
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 0 var(--spacing-lg);
        padding-bottom: var(--spacing-sm);
        border-bottom: 1px solid var(--color-border);
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }

    .form-label {
      display: block;
      font-weight: 500;
      margin-bottom: var(--spacing-xs);
      color: var(--color-text);
    }

    .form-input,
    .form-select,
    .form-textarea {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: 1rem;
      background: var(--color-background);
      color: var(--color-text);
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-light);
      }

      &::placeholder {
        color: var(--color-text-muted);
      }
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-select {
      cursor: pointer;
    }

    .form-error {
      color: var(--color-danger);
      font-size: 0.875rem;
      margin-top: var(--spacing-xs);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-md);
      padding-top: var(--spacing-md);
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-xl);
    }

    .loading__spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--color-border);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class EventFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  loading = false;
  submitting = false;
  private eventId: string | null = null;

  categories: { value: EventCategory; label: string }[] = [
    { value: 'concert', label: CATEGORY_LABELS['concert'] },
    { value: 'opera', label: CATEGORY_LABELS['opera'] },
    { value: 'theater', label: CATEGORY_LABELS['theater'] },
    { value: 'exhibition', label: CATEGORY_LABELS['exhibition'] },
  ];

  statuses: { value: EventStatus; label: string }[] = [
    { value: 'draft', label: STATUS_LABELS['draft'] },
    { value: 'published', label: STATUS_LABELS['published'] },
    { value: 'cancelled', label: STATUS_LABELS['cancelled'] },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: EventStore
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.isEditMode = true;
      this.loadEvent();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      status: ['draft', Validators.required],
      venue: ['', Validators.required],
      date: ['', Validators.required],
      ticketPrice: [0, [Validators.required, Validators.min(0)]],
      availableSeats: [0, [Validators.required, Validators.min(0)]],
      imageUrl: [''],
    });
  }

  private loadEvent(): void {
    this.loading = true;
    this.store.selectEvent(this.eventId);
    this.store.selectedEvent$.subscribe((event) => {
      if (event) {
        this.patchForm(event);
        this.loading = false;
      }
    });
  }

  private patchForm(event: CulturalEvent): void {
    const dateValue = new Date(event.date).toISOString().slice(0, 16);
    this.form.patchValue({
      title: event.title,
      description: event.description,
      category: event.category,
      status: event.status,
      venue: event.venue,
      date: dateValue,
      ticketPrice: event.ticketPrice,
      availableSeats: event.availableSeats,
      imageUrl: event.imageUrl || '',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting = true;
    const formValue = this.form.value;

    const eventData = {
      ...formValue,
      date: new Date(formValue.date),
      imageUrl:
        formValue.imageUrl ||
        `https://picsum.photos/seed/${Date.now()}/400/300`,
    };

    if (this.isEditMode && this.eventId) {
      this.store.updateEvent(this.eventId, eventData).subscribe({
        next: () => this.router.navigate(['/events', this.eventId]),
        error: () => (this.submitting = false),
      });
    } else {
      this.store.createEvent(eventData).subscribe({
        next: (event) => this.router.navigate(['/events', event.id]),
        error: () => (this.submitting = false),
      });
    }
  }
}
