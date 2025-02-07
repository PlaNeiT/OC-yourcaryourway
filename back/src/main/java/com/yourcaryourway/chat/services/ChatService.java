package com.yourcaryourway.chat.services;

import com.yourcaryourway.chat.models.Message;
import com.yourcaryourway.chat.repositories.MessageRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ChatService {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ChatService(SimpMessagingTemplate messagingTemplate, MessageRepository messageRepository) {
        this.messagingTemplate = messagingTemplate;
        this.messageRepository = messageRepository;
    }

    public void sendMessage(Message message) {
        message.setTimestamp(LocalDateTime.now().format(FORMATTER));
        messageRepository.save(message);
        messagingTemplate.convertAndSend("/topic/messages", message);
    }

    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    public void clearMessages() {
        messageRepository.deleteAll();
    }
}
