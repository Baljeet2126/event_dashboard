import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header__brand">
        <a routerLink="/" class="header__logo">
          <span class="header__logo-icon">🎭</span>
          <span class="header__logo-text">Kulturprogramm</span>
        </a>
      </div>

      <nav class="header__nav">
        <a
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="header__link"
        >
          Events
        </a>
        <a
          routerLink="/events/new"
          routerLinkActive="active"
          class="header__link header__link--cta"
        >
          + New Event
        </a>
      </nav>
    </header>
  `,
  styles: `
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header__brand {
      display: flex;
      align-items: center;
    }

    .header__logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      text-decoration: none;
      color: var(--color-text);
    }

    .header__logo-icon {
      font-size: 1.5rem;
    }

    .header__logo-text {
      font-size: 1.25rem;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .header__nav {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .header__link {
      padding: var(--spacing-xs) var(--spacing-sm);
      text-decoration: none;
      color: var(--color-text-muted);
      font-weight: 500;
      border-radius: var(--radius-sm);
      transition: color 0.2s, background-color 0.2s;

      &:hover {
        color: var(--color-text);
      }

      &.active {
        color: var(--color-primary);
      }
    }

    .header__link--cta {
      background: var(--color-primary);
      color: white;
      padding: var(--spacing-xs) var(--spacing-md);

      &:hover {
        background: var(--color-primary-dark);
        color: white;
      }

      &.active {
        color: white;
      }
    }
  `,
})
export class HeaderComponent {}
