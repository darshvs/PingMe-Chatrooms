import {
  Component,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  ChatMessage,
  ChatService,
  ConnectionStatus
} from '../../Services/chat.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() username = '';
  @Input() room = '';
  @ViewChild('messagesContainer') private messagesContainer?: ElementRef<HTMLElement>;

  chatForm: FormGroup;
  messages$: Observable<ChatMessage[]>;
  connectionStatus$: Observable<ConnectionStatus>;
  error$: Observable<string | null>;
  private shouldStickToBottom = true;

  constructor(
    private fb: FormBuilder,
    private chatService: ChatService
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.messages$ = this.chatService.getMessages();
    this.connectionStatus$ = this.chatService.getConnectionStatus();
    this.error$ = this.chatService.getErrors();
  }

  ngOnInit(): void {
    this.joinIfReady();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['room'] || changes['username']) {
      this.joinIfReady();
    }
  }

  private joinIfReady(): void {
    if (this.room && this.username) {
      this.chatService.joinRoom(this.room, this.username);
    }
  }

  sendMessage(): void {
    if (this.chatForm.invalid) {
      return;
    }
    const message = String(this.chatForm.value.message || '').trim();
    if (!message) {
      this.chatForm.reset();
      return;
    }
    this.chatService.sendMessage(this.room, this.username, message);
    this.chatForm.reset();
    this.shouldStickToBottom = true;
  }

  onMessagesScroll(): void {
    const el = this.messagesContainer?.nativeElement;
    if (!el) {
      return;
    }
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.shouldStickToBottom = distanceFromBottom < 80;
  }

  ngAfterViewChecked(): void {
    if (this.shouldStickToBottom) {
      this.scrollToBottom();
    }
  }

  formatTime(timestamp?: string): string {
    if (!timestamp) {
      return '';
    }
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  trackByIndex(index: number): number {
    return index;
  }

  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}
