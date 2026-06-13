package com.alumniportal.dto.request;

import lombok.Data;

@Data
public class MessageRequest {
    private String receiverId;
    private String message;
}
