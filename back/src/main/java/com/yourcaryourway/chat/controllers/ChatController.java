package com.yourcaryourway.chat.controllers;

import com.yourcaryourway.chat.models.Message;
import com.yourcaryourway.chat.services.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/sendMessage")
    public void processMessage(Message message) {
        chatService.sendMessage(message);
    }

    @GetMapping
    public List<Message> getMessages() {
        return chatService.getAllMessages();
    }

    @DeleteMapping
    public void clearMessages() {
        chatService.clearMessages();
    }
}
