import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private chatRoom = '';
  private user = '';

  getUser(): string {
    return this.user;
  }

  setUser(user: string): void {
    this.user = (user || '').trim();
  }

  getchatRoom(): string {
    return this.chatRoom;
  }

  setchatRoom(chatRoom: string): void {
    this.chatRoom = (chatRoom || '').trim();
  }

  clear(): void {
    this.user = '';
    this.chatRoom = '';
  }
}
