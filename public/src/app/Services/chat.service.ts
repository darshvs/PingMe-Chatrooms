import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

interface Message {
  user: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: any;
  private url = 'http://localhost:3000'; // Update with your server URL
  private messagesSubject = new BehaviorSubject<Message[]>([]);

  constructor() {
    this.socket = io(this.url);
  }
  private initializeMessages(room: string, username: string): void {
    this.socket.on('message', (message: Message) => {
      const currentMessages = this.messagesSubject.value;
      this.messagesSubject.next([...currentMessages, message]);
    });
  }



  getMessages(): Observable<Message[]> {
    return this.messagesSubject.asObservable();
  }
  joinRoom(room: string, username: string): void {
    this.socket.emit('joinRoom', { room, username });
    this.initializeMessages(room, username);
  }

  sendMessage(room: string, username: string, message: string): void {
    this.socket.emit('message', { room, username, message });
  }

  joinExistingRoom(room: string, username: string): void {
    this.socket.emit('joinRoom', { room, username });
    this.initializeMessages(room, username);
  }
  getRooms(): string [] {
    return ['ChatRoom2','ChatRoom2', 'ChatRoom3'];
  }
}
