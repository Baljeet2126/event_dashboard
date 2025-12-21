// libs/shared/src/lib/services/favorites.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorites';

  private readonly _favorites = signal<Set<string>>(
    this.loadFromStorage()
  );

  /** Public readonly signal */
  readonly favorites = this._favorites.asReadonly();

  toggle(eventId: string): void {
    const next = new Set(this._favorites());
    next.has(eventId) ? next.delete(eventId) : next.add(eventId);
    this._favorites.set(next);
    this.persist(next);
  }

  clear(): void {
    this._favorites.set(new Set());
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // ---- persistence ----
  private loadFromStorage(): Set<string> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return new Set<string>(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set<string>();
    }
  }

  isFavorite(eventId: string): boolean {
    return this._favorites().has(eventId);
  }


  private persist(favorites: Set<string>): void {
    try {
      localStorage.setItem(
        this.STORAGE_KEY,
        JSON.stringify([...favorites])
      );
    } catch {
      console.warn('Failed to persist favorites');
    }
  }
}
