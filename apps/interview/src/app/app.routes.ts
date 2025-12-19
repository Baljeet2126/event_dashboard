import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/event-list/event-list.component').then(
        (m) => m.EventListComponent
      ),
  },
  {
    path: 'events/new',
    loadComponent: () =>
      import('./pages/event-form/event-form.component').then(
        (m) => m.EventFormComponent
      ),
  },
  {
    path: 'events/:id',
    loadComponent: () =>
      import('./pages/event-detail/event-detail.component').then(
        (m) => m.EventDetailComponent
      ),
  },
  {
    path: 'events/:id/edit',
    loadComponent: () =>
      import('./pages/event-form/event-form.component').then(
        (m) => m.EventFormComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
