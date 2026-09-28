import { Routes } from '@angular/router';

// Main UI is hosted by AppComponent (profile → room → chat).
// Keep lightweight routes for future expansion without breaking bootstrap.
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: '**', redirectTo: '' }
];
