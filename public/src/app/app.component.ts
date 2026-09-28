import { Component, OnInit } from '@angular/core';
import { ThemeService } from './Services/theme.service';
import { ChatWindowComponent } from './Components/chat-window/chat-window.component';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './Components/user-list/user-list.component';
import { AuthService } from './Services/auth.service';
import { ChatService, ConnectionStatus } from './Services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ChatWindowComponent,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    UserListComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'PingMe';

  profileForm: FormGroup;
  roomForm: FormGroup;
  username = '';
  currentRoom = '';
  formError = '';
  connectionStatus$: Observable<ConnectionStatus>;

  constructor(
    private fb: FormBuilder,
    public themeService: ThemeService,
    public authService: AuthService,
    private chatService: ChatService
  ) {
    this.profileForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(30),
          Validators.pattern(/^[a-zA-Z0-9 _-]+$/)
        ]
      ]
    });

    this.roomForm = this.fb.group({
      roomName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40),
          Validators.pattern(/^[a-zA-Z0-9][a-zA-Z0-9 _-]*$/)
        ]
      ]
    });

    this.connectionStatus$ = this.chatService.getConnectionStatus();
  }

  ngOnInit(): void {
    this.themeService.setTheme(true);
  }

  setUsername(): void {
    this.formError = '';
    if (this.profileForm.invalid) {
      this.formError = 'Enter a username (2–30 chars: letters, numbers, spaces, _ or -).';
      return;
    }
    const username = String(this.profileForm.value.username).trim();
    this.username = username;
    this.authService.setUser(username);
  }

  setRoom(): void {
    this.formError = '';
    if (this.roomForm.invalid) {
      this.formError =
        'Enter a room name (2–40 chars, start with a letter/number; spaces, _ or - allowed).';
      return;
    }
    const room = String(this.roomForm.value.roomName).trim();
    this.currentRoom = room;
    this.authService.setchatRoom(room);
  }

  onRoomSelected(room: string): void {
    if (!this.username || !room) {
      return;
    }
    this.currentRoom = room;
    this.authService.setchatRoom(room);
    this.roomForm.patchValue({ roomName: room });
  }
}
