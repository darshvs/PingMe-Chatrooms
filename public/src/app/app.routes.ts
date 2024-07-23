import { Routes } from '@angular/router';
import { ChatWindowComponent } from './Components/chat-window/chat-window.component';
import { ProfileComponent } from './Components/profile/profile.component';

export const routes: Routes = [
    { path: '', redirectTo: '/chat', pathMatch: 'full' },

  { path: 'chat', component: ChatWindowComponent },
  { path: 'profile', component: ProfileComponent },
];
