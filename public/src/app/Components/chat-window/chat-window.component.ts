import { Component, AfterViewChecked, ElementRef, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../Services/chat.service';
import { Observable, concat, merge, of, scan, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

interface Message {
  user: string;
  message: string;
}

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() username: string = '';
  @Input() room: string = '';
  @ViewChild('messagesContainer') private messagesContainer: ElementRef | undefined;
  chatForm: FormGroup;
  messages$: Observable<Message[]>;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private cdr: ChangeDetectorRef
  ) {
    this.chatForm = this.fb.group({
      message: ['', Validators.required]
    });
    this.messages$ = this.chatService.getMessages();
  }

  ngOnInit(): void {
    this.chatService.joinRoom(this.room, this.username);
  }

  sendMessage(): void {
    if (this.chatForm.valid) {
      const message = this.chatForm.value.message;
      this.chatService.sendMessage(this.room, this.username, message);
      this.chatForm.reset(); // Clear the input after sending
    }
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
}
