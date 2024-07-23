import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { ChatService } from '../../Services/chat.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  chatRooms:string[] = [];
  constructor( public authService: AuthService,public chatService: ChatService) {
  }
  ngOnInit() {
    this.chatRooms = this.chatService.getRooms();
  }
}
