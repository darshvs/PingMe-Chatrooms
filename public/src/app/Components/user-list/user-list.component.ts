import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatService } from '../../Services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  @Input() activeRoom = '';
  @Output() roomSelected = new EventEmitter<string>();

  suggestedRooms: string[] = [];
  roomUsers$: Observable<string[]>;

  constructor(public chatService: ChatService) {
    this.roomUsers$ = this.chatService.getRoomUsers();
  }

  ngOnInit(): void {
    this.suggestedRooms = this.chatService.getSuggestedRooms();
  }

  selectRoom(room: string): void {
    this.roomSelected.emit(room);
  }
}
