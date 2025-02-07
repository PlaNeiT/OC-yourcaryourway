import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  messages: any[] = [];
  messageContent: string = '';
  username: string = 'Utilisateur-' + Math.floor(Math.random() * 1000);

  constructor(private readonly chatService: ChatService) {}

  ngOnInit(): void {
    this.loadMessages();
    this.chatService.connect().subscribe((message) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.messageContent.trim()) {
      this.chatService.sendMessage({ sender: this.username, content: this.messageContent });
      this.messageContent = '';
      this.scrollToBottom();
    }
  }

  clearMessages(): void {
    this.chatService.clearMessages().subscribe(() => {
      this.messages = [];
      this.scrollToBottom();
    });
  }

  private loadMessages(): void {
    this.chatService.getMessages().subscribe((messages) => {
      this.messages = messages.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
