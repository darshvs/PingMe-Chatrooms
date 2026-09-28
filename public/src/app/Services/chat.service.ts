import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  user: string;
  message: string;
  timestamp?: string;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private readonly url = environment.socketUrl;
  private readonly messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private readonly connectionSubject = new BehaviorSubject<ConnectionStatus>('connecting');
  private readonly roomUsersSubject = new BehaviorSubject<string[]>([]);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  private listenersBound = false;
  private currentRoom: string | null = null;

  constructor() {
    this.socket = io(this.url, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });
    this.bindSocketListeners();
  }

  private bindSocketListeners(): void {
    if (this.listenersBound) {
      return;
    }
    this.listenersBound = true;

    this.socket.on('connect', () => {
      this.connectionSubject.next('connected');
      this.errorSubject.next(null);
    });

    this.socket.on('disconnect', () => {
      this.connectionSubject.next('disconnected');
    });

    this.socket.on('connect_error', () => {
      this.connectionSubject.next('disconnected');
      this.errorSubject.next(
        'Unable to reach chat server. Is it running on ' + this.url + '?'
      );
    });

    this.socket.on('message', (message: ChatMessage) => {
      const current = this.messagesSubject.value;
      this.messagesSubject.next([...current, message]);
    });

    this.socket.on('messageHistory', (history: ChatMessage[]) => {
      this.messagesSubject.next(Array.isArray(history) ? history : []);
    });

    this.socket.on('roomUsers', (users: string[]) => {
      this.roomUsersSubject.next(Array.isArray(users) ? users : []);
    });

    this.socket.on('errorMessage', (payload: { message?: string }) => {
      this.errorSubject.next(payload?.message || 'Something went wrong.');
    });
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.messagesSubject.asObservable();
  }

  getConnectionStatus(): Observable<ConnectionStatus> {
    return this.connectionSubject.asObservable();
  }

  getRoomUsers(): Observable<string[]> {
    return this.roomUsersSubject.asObservable();
  }

  getErrors(): Observable<string | null> {
    return this.errorSubject.asObservable();
  }

  joinRoom(room: string, username: string): void {
    const cleanRoom = (room || '').trim();
    const cleanUser = (username || '').trim();
    if (!cleanRoom || !cleanUser) {
      this.errorSubject.next('Username and room are required.');
      return;
    }

    if (this.currentRoom !== cleanRoom) {
      this.messagesSubject.next([]);
      this.roomUsersSubject.next([]);
      this.currentRoom = cleanRoom;
    }

    this.errorSubject.next(null);
    this.socket.emit('joinRoom', { room: cleanRoom, username: cleanUser });
  }

  sendMessage(room: string, username: string, message: string): void {
    const cleanMessage = (message || '').trim();
    if (!cleanMessage) {
      return;
    }
    this.socket.emit('message', {
      room: (room || '').trim(),
      username: (username || '').trim(),
      message: cleanMessage
    });
  }

  getSuggestedRooms(): string[] {
    return ['General', 'Random', 'Help'];
  }

  /** @deprecated use getSuggestedRooms */
  getRooms(): string[] {
    return this.getSuggestedRooms();
  }
}
