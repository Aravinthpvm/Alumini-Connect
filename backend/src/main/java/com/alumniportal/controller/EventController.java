package com.alumniportal.controller;

import com.alumniportal.dto.request.EventRequest;
import com.alumniportal.dto.response.ApiResponse;
import com.alumniportal.model.Event;
import com.alumniportal.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Event>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllEvents()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<Event>>> getUpcomingEvents() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllUpcomingEvents()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Event>> createEvent(
            @RequestParam String organizerId,
            @RequestParam String organizerType,
            @RequestBody EventRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Event created",
                eventService.createEvent(organizerId, organizerType, request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Event>> getEventById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEventById(id)));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<ApiResponse<Event>> registerForEvent(
            @PathVariable String id,
            @RequestParam String userId,
            @RequestParam String userType) {
        return ResponseEntity.ok(ApiResponse.success("Registered successfully",
                eventService.registerForEvent(id, userId, userType)));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<ApiResponse<List<Event>>> getOrganizerEvents(@PathVariable String organizerId) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getOrganizerEvents(organizerId)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Event>> updateEventStatus(
            @PathVariable String id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", eventService.updateEventStatus(id, status)));
    }
}
