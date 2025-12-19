/**
 * Main Application Bootstrap
 *
 * This file bootstraps the Angular application.
 * No changes needed here for the challenge.
 *
 * Start by reading CHALLENGE.md and implementing your Task Management Dashboard.
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
