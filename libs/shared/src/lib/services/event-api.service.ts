import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { MOCK_EVENTS } from '../data/mock-events';
import { CulturalEvent } from '@shared';

/**
 * Simulates an API service for cultural events.
 * In a real app, this would make HTTP calls to a backend.
 */
@Injectable({
  providedIn: 'root',
})
export class EventApiService {
  private events: CulturalEvent[] = [...MOCK_EVENTS];
  private simulatedDelay = 800;

  getAll(): Observable<CulturalEvent[]> {
    return of([...this.events]).pipe(delay(this.simulatedDelay));
  }

  getById(id: string): Observable<CulturalEvent> {
    const event = this.events.find((e) => e.id === id);
    if (!event) {
      return throwError(() => new Error(`Event with id ${id} not found`));
    }
    return of({ ...event }).pipe(delay(this.simulatedDelay));
  }

  create(
    event: Omit<CulturalEvent, 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<CulturalEvent> {
    const newEvent: CulturalEvent = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.events = [...this.events, newEvent];
    this.persistToStorage();
    return of(newEvent).pipe(delay(this.simulatedDelay));
  }

  update(
    id: string,
    updates: Partial<CulturalEvent>
  ): Observable<CulturalEvent> {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Event with id ${id} not found`));
    }

    const updatedEvent: CulturalEvent = {
      ...this.events[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.events = [
      ...this.events.slice(0, index),
      updatedEvent,
      ...this.events.slice(index + 1),
    ];
    this.persistToStorage();
    return of(updatedEvent).pipe(delay(this.simulatedDelay));
  }

  delete(id: string): Observable<void> {
    const index = this.events.findIndex((e) => e.id === id);
    if (index === -1) {
      return throwError(() => new Error(`Event with id ${id} not found`));
    }
    this.events = this.events.filter((e) => e.id !== id);
    this.persistToStorage();
    return of(undefined).pipe(delay(this.simulatedDelay));
  }

  private persistToStorage(): void {
    try {
      localStorage.setItem('cultural-events', JSON.stringify(this.events));
    } catch {
      console.warn('Failed to persist events to localStorage');
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('cultural-events');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.events = parsed.map((e: CulturalEvent) => ({
          ...e,
          date: new Date(e.date),
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
        }));
      }
    } catch {
      console.warn('Failed to load events from localStorage');
    }
  }

  constructor() {
    this.loadFromStorage();
  }
}
