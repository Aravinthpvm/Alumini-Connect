package com.alumniportal.controller;

import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Conversation;
import com.alumniportal.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations/{userId}")
    public ResponseEntity<ApiResponse<List<Conversation>>> getConversations(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(messageService.getUserConversations(userId)));
    }

    @PostMapping("/conversations")
    public ResponseEntity<ApiResponse<Conversation>> createOrGetConversation(
            @RequestBody Map<String, String> params) {
        return ResponseEntity.ok(ApiResponse.success(
                messageService.getOrCreateConversation(
                        params.get("senderId"), params.get("senderType"),
                        params.get("senderName"), params.get("senderPicture"),
                        params.get("receiverId"), params.get("receiverType"),
                        params.get("receiverName"), params.get("receiverPicture"))));
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<ApiResponse<Conversation>> getMessages(
            @PathVariable String conversationId,
            @RequestParam String userId) {
        return ResponseEntity.ok(ApiResponse.success(
                messageService.getConversationById(conversationId, userId)));
    }

    @PostMapping("/conversations/{conversationId}/send")
    public ResponseEntity<ApiResponse<Conversation>> sendMessage(
            @PathVariable String conversationId,
            @RequestParam String senderId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Message sent",
                messageService.sendMessage(conversationId, senderId, body.get("message"))));
    }
}
