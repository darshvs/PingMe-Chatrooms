import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './Services/theme.service';
import { ChatWindowComponent } from "./Components/chat-window/chat-window.component";
import { MatButtonModule } from "@angular/material/button"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserListComponent } from "./Components/user-list/user-list.component";
import { AuthService } from './Services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChatWindowComponent, MatButtonModule, ReactiveFormsModule, CommonModule, UserListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PingMe';

  profileForm: FormGroup;
  roomForm: FormGroup;
  username: string = '';
  currentRoom: string = '';

  constructor(private fb: FormBuilder, public themeService: ThemeService, public authService: AuthService) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required]
    });

    this.roomForm = this.fb.group({
      roomName: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.themeService.setTheme(true)
  }
  setUsername(): void {
    if (this.profileForm.valid) {
      const username = this.profileForm.value.username + Math.floor(Math.random() * 1000);
      this.username = username;
      this.authService.setUser(username);
    }
  }

  setRoom(): void {
    if (this.roomForm.valid) {
      this.currentRoom = this.roomForm.value.roomName;
      this.authService.setchatRoom(this.currentRoom);
    }
  }

}

