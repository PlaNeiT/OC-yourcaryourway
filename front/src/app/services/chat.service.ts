import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';
import SockJS from "sockjs-client";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient!: Client;
  private readonly messageSubject = new Subject<any>();
  private readonly API_URL = '/api/messages';

  constructor(private readonly http: HttpClient) {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const socket = new SockJS('/chat-websocket');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (msg) => console.log(msg),
      reconnectDelay: 5000
    });

    this.stompClient.onConnect = () => {
      this.stompClient.subscribe('/topic/messages', (message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.activate();
  }

  connect(): Observable<any> {
    return this.messageSubject.asObservable();
  }

  sendMessage(message: any): void {
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination: '/app/sendMessage',
        body: JSON.stringify(message)
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  }

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.API_URL);
  }

  clearMessages(): Observable<void> {
    return this.http.delete<void>(this.API_URL);
  }
}
